import { transform as Ot, toLonLat as Nr, Projection as Wo, addProjection as fr, addCoordinateTransforms as oi, getTransform as Ui, identityTransform as Fi } from "ol/proj";
import { View as Mg, Map as _o, Feature as Vo } from "ol";
import { Vector as Yn, Group as Ho, Tile as Wi } from "ol/layer";
import { XYZ as Rg, Google as Qo, Vector as Kn } from "ol/source";
import { Style as ee, Icon as MA, Stroke as dr, Fill as mr } from "ol/style";
class de {
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
let ht = class extends de {
  detail;
  constructor(t, e) {
    super(t), this.detail = e;
  }
};
const Yo = ["ALL", "OFF"], In = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class Ko {
  constructor(t = In.INFO) {
    this.level = t, this.make();
  }
  level;
  make() {
    const t = Object.keys(In).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Yo.includes(e)
    );
    for (const e of t) {
      const n = In[e], i = e.toLowerCase();
      this[i] = this.level <= n ? console.log : () => {
      };
    }
  }
}
function Jo(A, t) {
  return A.isMapbox() ? t.mapboxMap ? (A.mapboxMap = t.mapboxMap, !0) : (t.warn?.(
    "Mapbox GL JS is not available; skipping Mapbox source:",
    A.mapID
  ), !1) : typeof A.isMapLibre == "function" && A.isMapLibre() ? t.maplibreMap ? (A.maplibreMap = t.maplibreMap, !0) : (t.warn?.(
    "MapLibre GL JS is not available; skipping MapLibre source:",
    A.mapID
  ), !1) : !0;
}
const qo = {
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3
};
function Sg(A, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = A, n;
}
function le(A, t, e = {}) {
  if (!A)
    throw new Error("coordinates is required");
  if (!Array.isArray(A))
    throw new Error("coordinates must be an Array");
  if (A.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!gs(A[0]) || !gs(A[1]))
    throw new Error("coordinates must contain numbers");
  return Sg({
    type: "Point",
    coordinates: A
  }, t, e);
}
function pr(A, t, e = {}) {
  for (const n of A) {
    if (n.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (n[n.length - 1].length !== n[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let i = 0; i < n[n.length - 1].length; i++)
      if (n[n.length - 1][i] !== n[0][i])
        throw new Error("First and last Position are not equivalent.");
  }
  return Sg({
    type: "Polygon",
    coordinates: A
  }, t, e);
}
function RA(A, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = A, e;
}
function gs(A) {
  return !isNaN(A) && A !== null && !Array.isArray(A);
}
function $o(A) {
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
function os(A) {
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
function ta(A) {
  return A.type === "Feature" ? A.geometry : A;
}
const ue = 11102230246251565e-32, ft = 134217729, ea = (3 + 8 * ue) * ue;
function _i(A, t, e, n, i) {
  let r, s, o, g, a = t[0], C = n[0], I = 0, c = 0;
  C > a == C > -a ? (r = a, a = t[++I]) : (r = C, C = n[++c]);
  let u = 0;
  if (I < A && c < e)
    for (C > a == C > -a ? (s = a + r, o = r - (s - a), a = t[++I]) : (s = C + r, o = r - (s - C), C = n[++c]), r = s, o !== 0 && (i[u++] = o); I < A && c < e; )
      C > a == C > -a ? (s = r + a, g = s - r, o = r - (s - g) + (a - g), a = t[++I]) : (s = r + C, g = s - r, o = r - (s - g) + (C - g), C = n[++c]), r = s, o !== 0 && (i[u++] = o);
  for (; I < A; )
    s = r + a, g = s - r, o = r - (s - g) + (a - g), a = t[++I], r = s, o !== 0 && (i[u++] = o);
  for (; c < e; )
    s = r + C, g = s - r, o = r - (s - g) + (C - g), C = n[++c], r = s, o !== 0 && (i[u++] = o);
  return (r !== 0 || u === 0) && (i[u++] = r), u;
}
function Aa(A, t) {
  let e = t[0];
  for (let n = 1; n < A; n++) e += t[n];
  return e;
}
function wn(A) {
  return new Float64Array(A);
}
const na = (3 + 16 * ue) * ue, ia = (2 + 12 * ue) * ue, ra = (9 + 64 * ue) * ue * ue, aA = wn(4), as = wn(8), Is = wn(12), Cs = wn(16), vt = wn(4);
function sa(A, t, e, n, i, r, s) {
  let o, g, a, C, I, c, u, d, f, m, h, w, S, b, P, x, D, B;
  const X = A - i, j = e - i, k = t - r, G = n - r;
  b = X * G, c = ft * X, u = c - (c - X), d = X - u, c = ft * G, f = c - (c - G), m = G - f, P = d * m - (b - u * f - d * f - u * m), x = k * j, c = ft * k, u = c - (c - k), d = k - u, c = ft * j, f = c - (c - j), m = j - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, aA[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, aA[1] = S - (h + I) + (I - x), B = w + h, I = B - w, aA[2] = w - (B - I) + (h - I), aA[3] = B;
  let U = Aa(4, aA), q = ia * s;
  if (U >= q || -U >= q || (I = A - X, o = A - (X + I) + (I - i), I = e - j, a = e - (j + I) + (I - i), I = t - k, g = t - (k + I) + (I - r), I = n - G, C = n - (G + I) + (I - r), o === 0 && g === 0 && a === 0 && C === 0) || (q = ra * s + ea * Math.abs(U), U += X * C + G * o - (k * a + j * g), U >= q || -U >= q)) return U;
  b = o * G, c = ft * o, u = c - (c - o), d = o - u, c = ft * G, f = c - (c - G), m = G - f, P = d * m - (b - u * f - d * f - u * m), x = g * j, c = ft * g, u = c - (c - g), d = g - u, c = ft * j, f = c - (c - j), m = j - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, vt[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, vt[1] = S - (h + I) + (I - x), B = w + h, I = B - w, vt[2] = w - (B - I) + (h - I), vt[3] = B;
  const pt = _i(4, aA, 4, vt, as);
  b = X * C, c = ft * X, u = c - (c - X), d = X - u, c = ft * C, f = c - (c - C), m = C - f, P = d * m - (b - u * f - d * f - u * m), x = k * a, c = ft * k, u = c - (c - k), d = k - u, c = ft * a, f = c - (c - a), m = a - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, vt[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, vt[1] = S - (h + I) + (I - x), B = w + h, I = B - w, vt[2] = w - (B - I) + (h - I), vt[3] = B;
  const O = _i(pt, as, 4, vt, Is);
  b = o * C, c = ft * o, u = c - (c - o), d = o - u, c = ft * C, f = c - (c - C), m = C - f, P = d * m - (b - u * f - d * f - u * m), x = g * a, c = ft * g, u = c - (c - g), d = g - u, c = ft * a, f = c - (c - a), m = a - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, vt[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, vt[1] = S - (h + I) + (I - x), B = w + h, I = B - w, vt[2] = w - (B - I) + (h - I), vt[3] = B;
  const tt = _i(O, Is, 4, vt, Cs);
  return Cs[tt - 1];
}
function ga(A, t, e, n, i, r) {
  const s = (t - r) * (e - i), o = (A - i) * (n - r), g = s - o, a = Math.abs(s + o);
  return Math.abs(g) >= na * a ? g : -sa(A, t, e, n, i, r, a);
}
function oa(A, t) {
  var e, n, i = 0, r, s, o, g, a, C, I, c = A[0], u = A[1], d = t.length;
  for (e = 0; e < d; e++) {
    n = 0;
    var f = t[e], m = f.length - 1;
    if (C = f[0], C[0] !== f[m][0] && C[1] !== f[m][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = C[0] - c, o = C[1] - u, n; n < m; n++) {
      if (I = f[n + 1], g = I[0] - c, a = I[1] - u, o === 0 && a === 0) {
        if (g <= 0 && s >= 0 || s <= 0 && g >= 0)
          return 0;
      } else if (a >= 0 && o <= 0 || a <= 0 && o >= 0) {
        if (r = ga(s, g, o, a, 0, 0), r === 0)
          return 0;
        (r > 0 && a > 0 && o <= 0 || r < 0 && a <= 0 && o > 0) && i++;
      }
      C = I, o = a, s = g;
    }
  }
  return i % 2 !== 0;
}
function Fe(A, t, e = {}) {
  if (!A)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = $o(A), i = ta(t), r = i.type, s = t.bbox;
  let o = i.coordinates;
  if (s && aa(n, s) === !1)
    return !1;
  r === "Polygon" && (o = [o]);
  for (var g = 0; g < o.length; ++g) {
    const a = oa(n, o[g]);
    if (a === 0 && !e.ignoreBoundary || a) return !0;
  }
  return !1;
}
function aa(A, t) {
  return t[0] <= A[0] && t[1] <= A[1] && t[2] >= A[0] && t[3] >= A[1];
}
function Vi(A, t) {
  for (let e = 0; e < t.features.length; e++)
    if (Fe(A, t.features[e]))
      return t.features[e];
}
function Tg(A, t) {
  const e = t.geometry.coordinates[0][0], n = t.geometry.coordinates[0][1], i = t.geometry.coordinates[0][2], r = A.geometry.coordinates, s = t.properties.a.geom, o = t.properties.b.geom, g = t.properties.c.geom, a = [n[0] - e[0], n[1] - e[1]], C = [i[0] - e[0], i[1] - e[1]], I = [r[0] - e[0], r[1] - e[1]], c = [o[0] - s[0], o[1] - s[1]], u = [g[0] - s[0], g[1] - s[1]], d = (C[1] * I[0] - C[0] * I[1]) / (a[0] * C[1] - a[1] * C[0]), f = (a[0] * I[1] - a[1] * I[0]) / (a[0] * C[1] - a[1] * C[0]);
  return [
    d * c[0] + f * u[0] + s[0],
    d * c[1] + f * u[1] + s[1]
  ];
}
function Ia(A, t, e) {
  const n = A.geometry.coordinates, i = e.geometry.coordinates, r = Math.atan2(n[0] - i[0], n[1] - i[1]), s = ca(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const o = t[1][s];
  return Tg(A, o.features[0]);
}
function Ca(A, t, e, n, i, r, s, o) {
  let g;
  if (s && (g = Vi(A, RA([s]))), !g)
    if (e) {
      const a = A.geometry.coordinates, C = e.gridNum, I = e.xOrigin, c = e.yOrigin, u = e.xUnit, d = e.yUnit, f = e.gridCache, m = $t(a[0], I, u, C), h = $t(a[1], c, d, C), w = f[m] ? f[m][h] ? f[m][h] : [] : [], S = RA(w.map((b) => t.features[b]));
      g = Vi(A, S);
    } else
      g = Vi(A, t);
  return o && o(g), g ? Tg(A, g) : Ia(A, n, i);
}
function $t(A, t, e, n) {
  let i = Math.floor((A - t) / e);
  return i < 0 && (i = 0), i >= n && (i = n - 1), i;
}
function ca(A, t) {
  let e = cs(A - t[0]), n = Math.PI * 2, i;
  for (let r = 0; r < t.length; r++) {
    const s = (r + 1) % t.length, o = cs(A - t[s]), g = Math.min(Math.abs(e), Math.abs(o));
    e * o <= 0 && g < n && (n = g, i = r), e = o;
  }
  return i;
}
function cs(A, t = !1) {
  const e = 2 * Math.PI, n = A - Math.floor(A / e) * e;
  return t ? n : n > Math.PI ? n - e : n;
}
function la(A) {
  const t = [0, 1, 2, 0].map((n) => A[n][0][0]), e = {
    a: { geom: A[0][0][1], index: A[0][1] },
    b: { geom: A[1][0][1], index: A[1][1] },
    c: { geom: A[2][0][1], index: A[2][1] }
  };
  return pr([t], e);
}
function yr(A, t, e, n, i, r = !1, s) {
  const o = A.map(
    (g) => {
      (!s || s < 2.00703) && (g = ua(g));
      const a = isFinite(g) ? t[g] : g === "c" ? n : (function() {
        const C = g.match(/^b(\d+)$/);
        if (C) return i[parseInt(C[1])];
        const I = g.match(/^e(\d+)$/);
        if (I) return e[parseInt(I[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return r ? [[a[1], a[0]], g] : [[a[0], a[1]], g];
    }
  );
  return la(o);
}
function ua(A) {
  return typeof A == "number" ? A : A.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function ha(A, t) {
  return t && t >= 2.00703 || Array.isArray(A[0]) ? A : A.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
const fa = 2.00704;
function da(A) {
  return !!(A.version !== void 0 || !A.tins && A.points && A.tins_points);
}
function ma(A) {
  return {
    points: A.points,
    strictStatus: ya(A),
    verticesParams: wa(A),
    centroid: va(A),
    edges: ha(A.edges || []),
    edgeNodes: A.edgeNodes || [],
    tins: ba(A),
    kinks: Ea(A.kinks_points),
    yaxisMode: A.yaxisMode ?? "invert",
    strictMode: A.strictMode ?? "auto",
    vertexMode: A.vertexMode,
    bounds: A.bounds,
    boundsPolygon: A.boundsPolygon,
    wh: A.wh,
    xy: A.xy ?? [0, 0]
  };
}
function pa(A) {
  const t = Ma(A), e = t.tins;
  return {
    compiled: t,
    tins: e,
    points: Ra(e),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function ya(A) {
  return A.strict_status ? A.strict_status : A.kinks_points ? "strict_error" : A.tins_points.length === 2 ? "loose" : "strict";
}
function wa(A) {
  const t = {
    forw: [A.vertices_params[0]],
    bakw: [A.vertices_params[1]]
  };
  return t.forw[1] = ls(A, !1), t.bakw[1] = ls(A, !0), t;
}
function ls(A, t) {
  const e = A.vertices_points.length;
  return Array.from({ length: e }, (n, i) => {
    const r = (i + 1) % e, s = yr(
      ["c", `b${i}`, `b${r}`],
      A.points,
      A.edgeNodes || [],
      A.centroid_point,
      A.vertices_points,
      t,
      fa
    );
    return RA([s]);
  });
}
function va(A) {
  return {
    forw: le(A.centroid_point[0], {
      target: {
        geom: A.centroid_point[1],
        index: "c"
      }
    }),
    bakw: le(A.centroid_point[1], {
      target: {
        geom: A.centroid_point[0],
        index: "c"
      }
    })
  };
}
function ba(A) {
  const t = A.tins_points.length === 1 ? 0 : 1;
  return {
    forw: RA(
      A.tins_points[0].map(
        (e) => yr(
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
    bakw: RA(
      A.tins_points[t].map(
        (e) => yr(
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
function Ea(A) {
  if (A)
    return {
      bakw: RA(
        A.map((t) => le(t))
      )
    };
}
function Ma(A) {
  return JSON.parse(
    JSON.stringify(A).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function Ra(A) {
  const t = [], e = A.forw.features;
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    ["a", "b", "c"].forEach((r, s) => {
      const o = i.geometry.coordinates[0][s], g = i.properties[r].geom, a = i.properties[r].index;
      typeof a == "number" && (t[a] = [o, g]);
    });
  }
  return t;
}
class Gt {
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
  yaxisMode = Gt.YAXIS_INVERT;
  strictMode = Gt.MODE_AUTO;
  vertexMode = Gt.VERTEX_PLAIN;
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
    if (da(t)) {
      this.applyModernState(ma(t));
      return;
    }
    this.applyLegacyState(pa(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? Gt.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? Gt.VERTEX_PLAIN, this.strictMode = t.strictMode ?? Gt.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
    const t = this.tins, e = t.forw, n = t.bakw, i = Math.ceil(Math.sqrt(e.features.length));
    if (i < 3) {
      this.indexedTins = void 0;
      return;
    }
    let r = [], s = [];
    const o = e.features.map((f) => {
      let m = [];
      return os(f)[0].map((h) => {
        r.length === 0 ? r = [Array.from(h), Array.from(h)] : (h[0] < r[0][0] && (r[0][0] = h[0]), h[0] > r[1][0] && (r[1][0] = h[0]), h[1] < r[0][1] && (r[0][1] = h[1]), h[1] > r[1][1] && (r[1][1] = h[1])), m.length === 0 ? m = [Array.from(h), Array.from(h)] : (h[0] < m[0][0] && (m[0][0] = h[0]), h[0] > m[1][0] && (m[1][0] = h[0]), h[1] < m[0][1] && (m[0][1] = h[1]), h[1] > m[1][1] && (m[1][1] = h[1]));
      }), m;
    }), g = (r[1][0] - r[0][0]) / i, a = (r[1][1] - r[0][1]) / i, C = o.reduce(
      (f, m, h) => {
        const w = $t(m[0][0], r[0][0], g, i), S = $t(m[1][0], r[0][0], g, i), b = $t(m[0][1], r[0][1], a, i), P = $t(m[1][1], r[0][1], a, i);
        for (let x = w; x <= S; x++) {
          f[x] || (f[x] = []);
          for (let D = b; D <= P; D++)
            f[x][D] || (f[x][D] = []), f[x][D].push(h);
        }
        return f;
      },
      []
    ), I = n.features.map((f) => {
      let m = [];
      return os(f)[0].map((h) => {
        s.length === 0 ? s = [Array.from(h), Array.from(h)] : (h[0] < s[0][0] && (s[0][0] = h[0]), h[0] > s[1][0] && (s[1][0] = h[0]), h[1] < s[0][1] && (s[0][1] = h[1]), h[1] > s[1][1] && (s[1][1] = h[1])), m.length === 0 ? m = [Array.from(h), Array.from(h)] : (h[0] < m[0][0] && (m[0][0] = h[0]), h[0] > m[1][0] && (m[1][0] = h[0]), h[1] < m[0][1] && (m[0][1] = h[1]), h[1] > m[1][1] && (m[1][1] = h[1]));
      }), m;
    }), c = (s[1][0] - s[0][0]) / i, u = (s[1][1] - s[0][1]) / i, d = I.reduce(
      (f, m, h) => {
        const w = $t(m[0][0], s[0][0], c, i), S = $t(m[1][0], s[0][0], c, i), b = $t(m[0][1], s[0][1], u, i), P = $t(m[1][1], s[0][1], u, i);
        for (let x = w; x <= S; x++) {
          f[x] || (f[x] = []);
          for (let D = b; D <= P; D++)
            f[x][D] || (f[x][D] = []), f[x][D].push(h);
        }
        return f;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: i,
        xOrigin: r[0][0],
        yOrigin: r[0][1],
        xUnit: g,
        yUnit: a,
        gridCache: C
      },
      bakw: {
        gridNum: i,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: c,
        yUnit: u,
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
  transform(t, e, n) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (e && this.strict_status == Gt.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == Gt.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const i = le(t);
    if (this.bounds && !e && !n && !Fe(i, this.boundsPolygon))
      return !1;
    const r = e ? this.tins.bakw : this.tins.forw, s = e ? this.indexedTins.bakw : this.indexedTins.forw, o = e ? this.vertices_params.bakw : this.vertices_params.forw, g = e ? this.centroid.bakw : this.centroid.forw;
    let a, C;
    this.stateFull && (this.stateBackward == e ? a = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), C = (c) => {
      this.stateTriangle = c;
    });
    let I = Ca(
      i,
      r,
      s,
      o,
      g,
      void 0,
      a,
      C
    );
    if (this.bounds && e && !n) {
      const c = le(I);
      if (!Fe(c, this.boundsPolygon)) return !1;
    } else this.yaxisMode == Gt.YAXIS_FOLLOW && !e && (I = [I[0], -1 * I[1]]);
    return I;
  }
}
const V = 20037508342789244e-9, Pg = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];
function Gr(A, t) {
  return Math.floor(Math.min(A[0], A[1]) / 4) * V / 128 / Math.pow(2, t);
}
function xg(A, t) {
  const e = [];
  for (let n = 0; n < A.length; n++) {
    const i = A[n], r = i[0] * Math.cos(t) - i[1] * Math.sin(t), s = i[0] * Math.sin(t) + i[1] * Math.cos(t);
    e.push([r, s]);
  }
  return e;
}
function wr(A, t, e, n) {
  const i = Gr(n, t);
  return xg(Pg, e).map((r) => [
    r[0] * i + A[0],
    r[1] * i + A[1]
  ]);
}
function vr(A, t) {
  const e = A[0], n = A.slice(1, 5).map((c) => [
    c[0] - e[0],
    c[1] - e[1]
  ]), i = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  let r = 0, s = 0, o = 0;
  for (let c = 0; c < 4; c++) {
    const u = n[c], d = i[c], f = Math.sqrt(Math.pow(u[0], 2) + Math.pow(u[1], 2));
    r += f;
    const m = u[0] * d[1] - u[1] * d[0], h = Math.acos(
      (u[0] * d[0] + u[1] * d[1]) / f
    ), w = m > 0 ? -1 * h : h;
    s += Math.cos(w), o += Math.sin(w);
  }
  const g = r / 4, a = Math.atan2(o, s), C = Math.floor(Math.min(t[0], t[1]) / 4), I = Math.log(C * V / 128 / g) / Math.log(2);
  return { center: e, zoom: I, rotation: a };
}
function Hi(A, t) {
  const e = A[0] * (2 * V) / t - V, n = -1 * (A[1] * (2 * V) / t - V);
  return [e, n];
}
function us(A, t) {
  const e = (A[0] + V) * t / (2 * V), n = (-A[1] + V) * t / (2 * V);
  return [e, n];
}
const Qi = 256;
class Dg {
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
    const e = new Gt();
    if (e.setCompiled(t.compiled), this.mainTin = e, t.maxZoom !== void 0)
      this._maxxy = Math.pow(2, t.maxZoom) * Qi;
    else if (t.compiled.wh) {
      const n = Math.max(t.compiled.wh[0], t.compiled.wh[1]), i = Math.ceil(Math.log2(n / Qi));
      this._maxxy = Math.pow(2, i) * Qi;
    }
    if (this.subTins = [], t.sub_maps)
      for (const n of t.sub_maps) {
        const i = new Gt();
        i.setCompiled(n.compiled);
        const r = n.bounds ?? n.compiled.bounds;
        if (!r)
          throw new Error(
            "SubMapData must have bounds or compiled.bounds to create xyBounds polygon"
          );
        const s = [...r, r[0]], o = s.map((g) => {
          const a = i.transform(g, !1);
          if (!a) throw new Error("Failed to transform sub-map bounds to mercator");
          return a;
        });
        this.subTins.push({
          tin: i,
          priority: n.priority,
          importance: n.importance,
          xyBounds: pr([s]),
          mercBounds: pr([o])
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
      const { index: i, isMain: r } = e[n];
      if (r || Fe(le(t), this.subTins[i - 1].xyBounds)) {
        const s = this._transformByIndex(t, i, !1);
        if (s === !1) continue;
        return [i, s];
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
    return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: e, tin: n, isMain: i }) => {
      const r = this._transformByIndex(t, e, !0);
      return r === !1 ? [n, e] : i || Fe(le(r), this.subTins[e - 1].xyBounds) ? [n, e, r] : [n, e];
    }).sort((e, n) => {
      const i = e[0].priority ?? 0, r = n[0].priority ?? 0;
      return i < r ? 1 : -1;
    }).reduce(
      (e, n, i, r) => {
        const s = n[0], o = n[1], g = n[2];
        if (!g) return e;
        for (let a = 0; a < i; a++) {
          const C = r[a][1], I = C === 0;
          if (r[a][2] && (I || Fe(le(g), this.subTins[C - 1].xyBounds)))
            if (e.length) {
              const c = !e[0], u = c ? e[1][2] : e[0][2], d = s.importance ?? 0, f = u.importance ?? 0;
              return c ? d < f ? e : [void 0, [o, g, s]] : [...e.filter(
                (m) => m !== void 0
              ), [o, g, s]].sort(
                (m, h) => (m[2].importance ?? 0) < (h[2].importance ?? 0) ? 1 : -1
              ).slice(0, 2);
            } else
              return [[o, g, s]];
        }
        return !e.length || !e[0] ? [[o, g, s]] : (e.push([o, g, s]), e.sort((a, C) => {
          const I = a[2].importance ?? 0, c = C[2].importance ?? 0;
          return I < c ? 1 : -1;
        }).filter((a, C) => C < 2));
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
    const e = this._getAllTinsWithIndex(), n = (g) => g === 0 ? 0 : this.subTins[g - 1].priority ?? 0, i = (g) => g === 0 ? 0 : this.subTins[g - 1].importance ?? 0, r = (g, a) => g === 0 || Fe(le(a), this.subTins[g - 1].xyBounds), s = [];
    for (const { index: g } of e) {
      const a = this._transformByIndex(t, g, !0);
      a !== !1 && r(g, a) && s.push({ index: g, xy: a });
    }
    const o = (g) => e.some(
      ({ index: a }) => a !== 0 && a !== g.index && (n(a) > n(g.index) || g.index === 0 && n(a) === 0) && r(a, g.xy)
    );
    return s.filter((g) => !o(g)).sort((g, a) => i(a.index) - i(g.index) || n(a.index) - n(g.index) || g.index - a.index).map((g) => [g.index, g.xy]);
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
    return e.map((i, r) => {
      if (!i) {
        n = !0;
        return;
      }
      const s = i[0], o = i[1];
      return r !== 0 && !n ? [this.xy2SysCoordInternal(o)] : t.map((g, a) => a === 0 ? o : this._transformByIndex(g, s, !0)).map((g) => this.xy2SysCoordInternal(g));
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
    const n = wr(t.center, t.zoom, t.rotation, e).map((o) => us(o, this._maxxy)), i = this.xy2MercWithLayer(n[0]);
    if (!i) throw new Error("viewpoint2Mercs: center point is out of bounds");
    const r = i[0], s = i[1];
    return n.map((o, g) => {
      if (g === 0) return s;
      const a = this._transformByIndex(o, r, !1);
      if (a === !1) throw new Error(`viewpoint2Mercs: point ${g} is out of bounds`);
      return a;
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
    const n = this.merc2XyWithLayer(t[0]), i = n[0] || n[1];
    if (!i) throw new Error("mercs2Viewpoint: center point is out of bounds");
    const r = i[0], s = i[1], o = t.map((g, a) => {
      if (a === 0) return s;
      const C = this._transformByIndex(g, r, !0);
      if (C === !1) throw new Error(`mercs2Viewpoint: point ${a} is out of bounds`);
      return C;
    }).map((g) => Hi(g, this._maxxy));
    return vr(o, e);
  }
  // ─── ユーティリティ（静的メソッド）────────────────────────────────────────
  /** zoom2Radius の静的ラッパー */
  static zoom2Radius(t, e) {
    return Gr(t, e);
  }
  /** mercViewpoint2Mercs の静的ラッパー */
  static mercViewpoint2Mercs(t, e, n, i) {
    return wr(t, e, n, i);
  }
  /** mercs2MercViewpoint の静的ラッパー */
  static mercs2MercViewpoint(t, e) {
    return vr(t, e);
  }
  /** xy2SysCoord の静的ラッパー */
  static xy2SysCoord(t, e) {
    return Hi(t, e);
  }
  /** sysCoord2Xy の静的ラッパー */
  static sysCoord2Xy(t, e) {
    return us(t, e);
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
      const n = t.tin.priority ?? 0, i = e.tin.priority ?? 0;
      return n < i ? 1 : -1;
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
    const i = this.subTins[e - 1];
    return i ? i.tin.transform(t, n, !0) : !1;
  }
  /** 内部用 xy2SysCoord（_maxxy を使用） */
  xy2SysCoordInternal(t) {
    return Hi(t, this._maxxy);
  }
}
const Bg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", ze = 256, Sa = `<canvas width="${ze}" height="${ze}" src="${Bg}"></canvas>`;
async function qA(A) {
  if (typeof A == "string") {
    const t = A.match(/\//) ? A : `pois/${A}`, e = await fetch(t);
    if (!e.ok)
      throw new Error("Fail to load poi json");
    return await e.json();
  } else
    return A;
}
const Og = ["hide", "title", "icon", "selectedIcon"], Ta = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
];
function ai(A) {
  return typeof A == "object" && A !== null && !Array.isArray(A);
}
function br(A) {
  if (!ai(A) || A.type === "FeatureCollection") return !1;
  const t = A.layer, e = typeof t == "string", n = ai(t) && t.type === "FeatureCollection";
  return !(!e && !n || Ta.some((i) => A[i] !== void 0));
}
function Pa(A) {
  return br(A) && Og.some((t) => A[t] !== void 0);
}
function hs(A) {
  const t = {};
  for (const [e, n] of Object.entries(A))
    if (e !== "layer") {
      if (Og.includes(e)) {
        t[e] = n;
        continue;
      }
      console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${e}`);
    }
  return t;
}
function fs(A, t) {
  if (!t) return A;
  t.hide === !0 && (A.hide = !0);
  const e = t.title;
  (typeof e == "string" ? e !== "" : ai(e) && Object.keys(e).length > 0) && (A.name = e);
  for (const n of ["icon", "selectedIcon"]) {
    const i = t[n];
    typeof i == "string" && i !== "" && (A[n] = i);
  }
  return A;
}
async function Lg(A, t) {
  if (A = await qA(A), Array.isArray(A)) {
    const e = A[0];
    if (A.length > 0 && (typeof e == "string" || ai(e) && e.type === "FeatureCollection" || br(e))) {
      const i = await Promise.all(
        A.map(async (r, s) => {
          let o, g;
          br(r) ? (o = await qA(r.layer), g = hs(r)) : (o = await qA(r), g = null);
          let a = o.id || o.properties && o.properties.id;
          if (!a)
            if (s === 0) a = "main";
            else throw "POI layers include bad key setting";
          const C = Pe(o, a, t);
          return [a, fs(C, g)];
        })
      );
      A = Object.fromEntries(i);
    } else
      A = await Promise.all(A.map(async (i) => await qA(i))), A = {
        main: Pe(A, "main", t)
      };
  } else if (A.type === "FeatureCollection") {
    const e = A.id || A.properties && A.properties.id || "main";
    A = { [e]: Pe(A, e, t) };
  } else if (Pa(A)) {
    const e = await qA(A.layer), n = e.id || e.properties && e.properties.id || "main", i = Pe(e, n, t);
    A = { [n]: fs(i, hs(A)) };
  } else
    Object.keys(A).map((e) => {
      A[e] = Pe(A[e], e, t);
    });
  return A.main || (A.main = Pe([], "main", t)), Object.keys(A).map((e) => {
    jr(A, e, t);
  }), A;
}
function Pe(A, t, e) {
  if (Array.isArray(A))
    A = {
      pois: A.map((n) => cn(n))
    };
  else if (A.type === "FeatureCollection") {
    const n = Object.assign({}, A.properties || {});
    A.name && (n.name = A.name), n.pois = A.features.map((i) => cn(i)), A = n;
  }
  if (typeof A.id > "u")
    A.id = t;
  else if (A.id !== t) throw "POI layers include bad key setting";
  return A.namespaceID || (A.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), A.name || (A.name = t === "main" ? e.name : t), A.pois || (A.pois = []), A;
}
function cn(A) {
  if (A.type === "Feature") {
    const t = Object.assign({}, A.properties || {});
    t.lnglat = A.geometry.coordinates, t.id || (t.id = A.id), t.name || (t.name = A.name), A = t;
  }
  return A.lnglat || (A.lnglat = [A.lng || A.longitude, A.lat || A.latitude]), delete A.lng, delete A.lat, delete A.longitude, delete A.latitude, A;
}
function jr(A, t, e) {
  if (!A[t]) return;
  const n = A[t], i = n.pois;
  n.__nextId || (n.__nextId = 0), i.map((r) => {
    r.id || (r.id = `${t}_${n.__nextId}`, n.__nextId++), r.namespaceID || (r.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${r.id}`);
  });
}
function ln(A, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = A, n;
}
function kg(A, t, e = {}) {
  if (!A)
    throw new Error("coordinates is required");
  if (!Array.isArray(A))
    throw new Error("coordinates must be an Array");
  if (A.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!ms(A[0]) || !ms(A[1]))
    throw new Error("coordinates must contain numbers");
  return ln({
    type: "Point",
    coordinates: A
  }, t, e);
}
function Ng(A, t, e = {}) {
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
  return ln({
    type: "Polygon",
    coordinates: A
  }, t, e);
}
function xa(A, t, e = {}) {
  if (A.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ln({
    type: "LineString",
    coordinates: A
  }, t, e);
}
function ds(A, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = A, e;
}
function ms(A) {
  return !isNaN(A) && A !== null && !Array.isArray(A);
}
function Da(A) {
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
function Ba(A) {
  return A.type === "Feature" ? A.geometry : A;
}
function Gg(A, t, e) {
  if (A !== null)
    for (var n, i, r, s, o, g, a, C = 0, I = 0, c, u = A.type, d = u === "FeatureCollection", f = u === "Feature", m = d ? A.features.length : 1, h = 0; h < m; h++) {
      a = d ? (
        // @ts-expect-error: Known type conflict
        A.features[h].geometry
      ) : f ? (
        // @ts-expect-error: Known type conflict
        A.geometry
      ) : A, c = a ? a.type === "GeometryCollection" : !1, o = c ? a.geometries.length : 1;
      for (var w = 0; w < o; w++) {
        var S = 0, b = 0;
        if (s = c ? a.geometries[w] : a, s !== null) {
          g = s.coordinates;
          var P = s.type;
          switch (C = P === "Polygon" || P === "MultiPolygon" ? 1 : 0, P) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  g,
                  I,
                  h,
                  S,
                  b
                ) === !1
              )
                return !1;
              I++, S++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < g.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    g[n],
                    I,
                    h,
                    S,
                    b
                  ) === !1
                )
                  return !1;
                I++, P === "MultiPoint" && S++;
              }
              P === "LineString" && S++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < g.length; n++) {
                for (i = 0; i < g[n].length - C; i++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      g[n][i],
                      I,
                      h,
                      S,
                      b
                    ) === !1
                  )
                    return !1;
                  I++;
                }
                P === "MultiLineString" && S++, P === "Polygon" && b++;
              }
              P === "Polygon" && S++;
              break;
            case "MultiPolygon":
              for (n = 0; n < g.length; n++) {
                for (b = 0, i = 0; i < g[n].length; i++) {
                  for (r = 0; r < g[n][i].length - C; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        g[n][i][r],
                        I,
                        h,
                        S,
                        b
                      ) === !1
                    )
                      return !1;
                    I++;
                  }
                  b++;
                }
                S++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Gg(s.geometries[n], t) === !1
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
const he = 11102230246251565e-32, dt = 134217729, Oa = (3 + 8 * he) * he;
function Yi(A, t, e, n, i) {
  let r, s, o, g, a = t[0], C = n[0], I = 0, c = 0;
  C > a == C > -a ? (r = a, a = t[++I]) : (r = C, C = n[++c]);
  let u = 0;
  if (I < A && c < e)
    for (C > a == C > -a ? (s = a + r, o = r - (s - a), a = t[++I]) : (s = C + r, o = r - (s - C), C = n[++c]), r = s, o !== 0 && (i[u++] = o); I < A && c < e; )
      C > a == C > -a ? (s = r + a, g = s - r, o = r - (s - g) + (a - g), a = t[++I]) : (s = r + C, g = s - r, o = r - (s - g) + (C - g), C = n[++c]), r = s, o !== 0 && (i[u++] = o);
  for (; I < A; )
    s = r + a, g = s - r, o = r - (s - g) + (a - g), a = t[++I], r = s, o !== 0 && (i[u++] = o);
  for (; c < e; )
    s = r + C, g = s - r, o = r - (s - g) + (C - g), C = n[++c], r = s, o !== 0 && (i[u++] = o);
  return (r !== 0 || u === 0) && (i[u++] = r), u;
}
function La(A, t) {
  let e = t[0];
  for (let n = 1; n < A; n++) e += t[n];
  return e;
}
function vn(A) {
  return new Float64Array(A);
}
const ka = (3 + 16 * he) * he, Na = (2 + 12 * he) * he, Ga = (9 + 64 * he) * he * he, IA = vn(4), ps = vn(8), ys = vn(12), ws = vn(16), bt = vn(4);
function ja(A, t, e, n, i, r, s) {
  let o, g, a, C, I, c, u, d, f, m, h, w, S, b, P, x, D, B;
  const X = A - i, j = e - i, k = t - r, G = n - r;
  b = X * G, c = dt * X, u = c - (c - X), d = X - u, c = dt * G, f = c - (c - G), m = G - f, P = d * m - (b - u * f - d * f - u * m), x = k * j, c = dt * k, u = c - (c - k), d = k - u, c = dt * j, f = c - (c - j), m = j - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, IA[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, IA[1] = S - (h + I) + (I - x), B = w + h, I = B - w, IA[2] = w - (B - I) + (h - I), IA[3] = B;
  let U = La(4, IA), q = Na * s;
  if (U >= q || -U >= q || (I = A - X, o = A - (X + I) + (I - i), I = e - j, a = e - (j + I) + (I - i), I = t - k, g = t - (k + I) + (I - r), I = n - G, C = n - (G + I) + (I - r), o === 0 && g === 0 && a === 0 && C === 0) || (q = Ga * s + Oa * Math.abs(U), U += X * C + G * o - (k * a + j * g), U >= q || -U >= q)) return U;
  b = o * G, c = dt * o, u = c - (c - o), d = o - u, c = dt * G, f = c - (c - G), m = G - f, P = d * m - (b - u * f - d * f - u * m), x = g * j, c = dt * g, u = c - (c - g), d = g - u, c = dt * j, f = c - (c - j), m = j - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, bt[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, bt[1] = S - (h + I) + (I - x), B = w + h, I = B - w, bt[2] = w - (B - I) + (h - I), bt[3] = B;
  const pt = Yi(4, IA, 4, bt, ps);
  b = X * C, c = dt * X, u = c - (c - X), d = X - u, c = dt * C, f = c - (c - C), m = C - f, P = d * m - (b - u * f - d * f - u * m), x = k * a, c = dt * k, u = c - (c - k), d = k - u, c = dt * a, f = c - (c - a), m = a - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, bt[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, bt[1] = S - (h + I) + (I - x), B = w + h, I = B - w, bt[2] = w - (B - I) + (h - I), bt[3] = B;
  const O = Yi(pt, ps, 4, bt, ys);
  b = o * C, c = dt * o, u = c - (c - o), d = o - u, c = dt * C, f = c - (c - C), m = C - f, P = d * m - (b - u * f - d * f - u * m), x = g * a, c = dt * g, u = c - (c - g), d = g - u, c = dt * a, f = c - (c - a), m = a - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, bt[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, bt[1] = S - (h + I) + (I - x), B = w + h, I = B - w, bt[2] = w - (B - I) + (h - I), bt[3] = B;
  const tt = Yi(O, ys, 4, bt, ws);
  return ws[tt - 1];
}
function Xa(A, t, e, n, i, r) {
  const s = (t - r) * (e - i), o = (A - i) * (n - r), g = s - o, a = Math.abs(s + o);
  return Math.abs(g) >= ka * a ? g : -ja(A, t, e, n, i, r, a);
}
function Za(A, t) {
  var e, n, i = 0, r, s, o, g, a, C, I, c = A[0], u = A[1], d = t.length;
  for (e = 0; e < d; e++) {
    n = 0;
    var f = t[e], m = f.length - 1;
    if (C = f[0], C[0] !== f[m][0] && C[1] !== f[m][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = C[0] - c, o = C[1] - u, n; n < m; n++) {
      if (I = f[n + 1], g = I[0] - c, a = I[1] - u, o === 0 && a === 0) {
        if (g <= 0 && s >= 0 || s <= 0 && g >= 0)
          return 0;
      } else if (a >= 0 && o <= 0 || a <= 0 && o >= 0) {
        if (r = Xa(s, g, o, a, 0, 0), r === 0)
          return 0;
        (r > 0 && a > 0 && o <= 0 || r < 0 && a <= 0 && o > 0) && i++;
      }
      C = I, o = a, s = g;
    }
  }
  return i % 2 !== 0;
}
function za(A, t, e = {}) {
  if (!A)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Da(A), i = Ba(t), r = i.type, s = t.bbox;
  let o = i.coordinates;
  if (s && Ua(n, s) === !1)
    return !1;
  r === "Polygon" && (o = [o]);
  for (var g = 0; g < o.length; ++g) {
    const a = Za(n, o[g]);
    if (a === 0 && !e.ignoreBoundary) return !0;
    if (a) return !0;
  }
  return !1;
}
function Ua(A, t) {
  return t[0] <= A[0] && t[1] <= A[1] && t[2] >= A[0] && t[3] >= A[1];
}
class jg {
  constructor(t = [], e = Fa) {
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
      let s = (t << 1) + 1, o = e[s];
      const g = s + 1;
      if (g < this.length && n(e[g], o) < 0 && (s = g, o = e[g]), n(o, r) >= 0) break;
      e[t] = o, t = s;
    }
    e[t] = r;
  }
}
function Fa(A, t) {
  return A < t ? -1 : A > t ? 1 : 0;
}
const fe = 11102230246251565e-32, mt = 134217729, Wa = (3 + 8 * fe) * fe;
function Ki(A, t, e, n, i) {
  let r, s, o, g, a = t[0], C = n[0], I = 0, c = 0;
  C > a == C > -a ? (r = a, a = t[++I]) : (r = C, C = n[++c]);
  let u = 0;
  if (I < A && c < e)
    for (C > a == C > -a ? (s = a + r, o = r - (s - a), a = t[++I]) : (s = C + r, o = r - (s - C), C = n[++c]), r = s, o !== 0 && (i[u++] = o); I < A && c < e; )
      C > a == C > -a ? (s = r + a, g = s - r, o = r - (s - g) + (a - g), a = t[++I]) : (s = r + C, g = s - r, o = r - (s - g) + (C - g), C = n[++c]), r = s, o !== 0 && (i[u++] = o);
  for (; I < A; )
    s = r + a, g = s - r, o = r - (s - g) + (a - g), a = t[++I], r = s, o !== 0 && (i[u++] = o);
  for (; c < e; )
    s = r + C, g = s - r, o = r - (s - g) + (C - g), C = n[++c], r = s, o !== 0 && (i[u++] = o);
  return (r !== 0 || u === 0) && (i[u++] = r), u;
}
function _a(A, t) {
  let e = t[0];
  for (let n = 1; n < A; n++) e += t[n];
  return e;
}
function bn(A) {
  return new Float64Array(A);
}
const Va = (3 + 16 * fe) * fe, Ha = (2 + 12 * fe) * fe, Qa = (9 + 64 * fe) * fe * fe, CA = bn(4), vs = bn(8), bs = bn(12), Es = bn(16), Et = bn(4);
function Ya(A, t, e, n, i, r, s) {
  let o, g, a, C, I, c, u, d, f, m, h, w, S, b, P, x, D, B;
  const X = A - i, j = e - i, k = t - r, G = n - r;
  b = X * G, c = mt * X, u = c - (c - X), d = X - u, c = mt * G, f = c - (c - G), m = G - f, P = d * m - (b - u * f - d * f - u * m), x = k * j, c = mt * k, u = c - (c - k), d = k - u, c = mt * j, f = c - (c - j), m = j - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, CA[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, CA[1] = S - (h + I) + (I - x), B = w + h, I = B - w, CA[2] = w - (B - I) + (h - I), CA[3] = B;
  let U = _a(4, CA), q = Ha * s;
  if (U >= q || -U >= q || (I = A - X, o = A - (X + I) + (I - i), I = e - j, a = e - (j + I) + (I - i), I = t - k, g = t - (k + I) + (I - r), I = n - G, C = n - (G + I) + (I - r), o === 0 && g === 0 && a === 0 && C === 0) || (q = Qa * s + Wa * Math.abs(U), U += X * C + G * o - (k * a + j * g), U >= q || -U >= q)) return U;
  b = o * G, c = mt * o, u = c - (c - o), d = o - u, c = mt * G, f = c - (c - G), m = G - f, P = d * m - (b - u * f - d * f - u * m), x = g * j, c = mt * g, u = c - (c - g), d = g - u, c = mt * j, f = c - (c - j), m = j - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, Et[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, Et[1] = S - (h + I) + (I - x), B = w + h, I = B - w, Et[2] = w - (B - I) + (h - I), Et[3] = B;
  const pt = Ki(4, CA, 4, Et, vs);
  b = X * C, c = mt * X, u = c - (c - X), d = X - u, c = mt * C, f = c - (c - C), m = C - f, P = d * m - (b - u * f - d * f - u * m), x = k * a, c = mt * k, u = c - (c - k), d = k - u, c = mt * a, f = c - (c - a), m = a - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, Et[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, Et[1] = S - (h + I) + (I - x), B = w + h, I = B - w, Et[2] = w - (B - I) + (h - I), Et[3] = B;
  const O = Ki(pt, vs, 4, Et, bs);
  b = o * C, c = mt * o, u = c - (c - o), d = o - u, c = mt * C, f = c - (c - C), m = C - f, P = d * m - (b - u * f - d * f - u * m), x = g * a, c = mt * g, u = c - (c - g), d = g - u, c = mt * a, f = c - (c - a), m = a - f, D = d * m - (x - u * f - d * f - u * m), h = P - D, I = P - h, Et[0] = P - (h + I) + (I - D), w = b + h, I = w - b, S = b - (w - I) + (h - I), h = S - x, I = S - h, Et[1] = S - (h + I) + (I - x), B = w + h, I = B - w, Et[2] = w - (B - I) + (h - I), Et[3] = B;
  const tt = Ki(O, bs, 4, Et, Es);
  return Es[tt - 1];
}
function Ms(A, t, e, n, i, r) {
  const s = (t - r) * (e - i), o = (A - i) * (n - r), g = s - o;
  if (s === 0 || o === 0 || s > 0 != o > 0) return g;
  const a = Math.abs(s + o);
  return Math.abs(g) >= Va * a ? g : -Ya(A, t, e, n, i, r, a);
}
function Ka(A, t) {
  const e = new jg([], Xg);
  return qa(A, e), tI(e, t);
}
function Xg(A, t) {
  return A.p.x > t.p.x ? 1 : A.p.x < t.p.x || A.p.x === t.p.x && (A.featureId !== t.featureId || A.ringId !== t.ringId) && A.isLeftEndpoint && !t.isLeftEndpoint ? -1 : A.p.y !== t.p.y ? A.p.y > t.p.y ? 1 : -1 : 1;
}
function Ja(A, t) {
  return A.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : A.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : A.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? A.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function qa(A, t) {
  {
    const e = A.features;
    for (let n = 0; n < e.length; n++)
      $a(e[n], t);
  }
}
var Jn = 0, qn = 0, $n = 0;
function $a(A, t) {
  const e = A.type === "Feature" ? A.geometry : A;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let i = 0; i < n.length; i++)
    for (let r = 0; r < n[i].length; r++) {
      let s = n[i][r][0], o = null;
      qn = qn + 1;
      for (let g = 0; g < n[i][r].length - 1; g++) {
        o = n[i][r][g + 1];
        const a = new Rs(s, Jn, qn, $n), C = new Rs(o, Jn, qn, $n + 1);
        a.otherEvent = C, C.otherEvent = a, Xg(a, C) > 0 ? (C.isLeftEndpoint = !0, a.isLeftEndpoint = !1) : (a.isLeftEndpoint = !0, C.isLeftEndpoint = !1), t.push(a), t.push(C), s = o, $n = $n + 1;
      }
    }
  Jn = Jn + 1;
}
var Rs = class {
  constructor(A, t, e, n) {
    this.p = {
      x: A[0],
      y: A[1]
    }, this.featureId = t, this.ringId = e, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(A) {
    return this.p.x === A.p.x && this.p.y === A.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function tI(A, t = !1) {
  const e = [], n = new jg([], Ja);
  for (; A.length; ) {
    const i = A.pop();
    if (i.isLeftEndpoint) {
      const r = new eI(i);
      for (let s = 0; s < n.data.length; s++) {
        const o = n.data[s];
        if (t && o.leftSweepEvent.featureId === i.featureId)
          continue;
        const g = AI(r, o);
        g !== !1 && e.push(g);
      }
      n.push(r);
    } else i.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var eI = class {
  /** @param event must have otherEvent non-null */
  constructor(A) {
    this.leftSweepEvent = A, this.rightSweepEvent = A.otherEvent;
  }
};
function AI(A, t) {
  if (A === null || t === null) return !1;
  const e = A.leftSweepEvent.p.x, n = A.leftSweepEvent.p.y, i = A.rightSweepEvent.p.x, r = A.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, o = t.leftSweepEvent.p.y, g = t.rightSweepEvent.p.x, a = t.rightSweepEvent.p.y, C = Ms(e, n, i, r, s, o), I = Ms(e, n, i, r, g, a);
  if (C > 0 && I > 0) return !1;
  if (C < 0 && I < 0) return !1;
  if (A.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (A.rightSweepEvent.isSamePoint(t.leftSweepEvent) || A.rightSweepEvent.isSamePoint(t.rightSweepEvent) || A.leftSweepEvent.isSamePoint(t.leftSweepEvent) || A.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (A.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (A.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (A.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (A.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const c = (a - o) * (i - e) - (g - s) * (r - n), u = (g - s) * (n - o) - (a - o) * (e - s), d = (i - e) * (n - o) - (r - n) * (e - s);
  if (c === 0)
    return !1;
  const f = u / c, m = d / c;
  if (f >= 0 && f <= 1 && m >= 0 && m <= 1) {
    const h = e + f * (i - e), w = n + f * (r - n);
    return [h, w];
  }
  return !1;
}
function nI(A, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: i = !0 } = e;
  let r = [];
  A.type === "FeatureCollection" ? r = r.concat(A.features) : A.type === "Feature" ? r.push(A) : (A.type === "LineString" || A.type === "Polygon" || A.type === "MultiLineString" || A.type === "MultiPolygon") && r.push(ln(A)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(ln(t));
  const s = Ka(
    ds(r),
    i
  );
  let o = [];
  if (n) {
    const g = {};
    s.forEach((a) => {
      const C = a.join(",");
      g[C] || (g[C] = !0, o.push(a));
    });
  } else
    o = s;
  return ds(o.map((g) => kg(g)));
}
function iI(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
function rI(A, t = {}) {
  let e = 0, n = 0, i = 0;
  return Gg(
    A,
    function(r) {
      e += r[0], n += r[1], i++;
    }
  ), kg([e / i, n / i], t.properties);
}
function Zg(A) {
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
      if (n = Ae(n), this.mapID = n.mapID, this.homePosition = n.homePosition, this.mercZoom = n.mercZoom, this.label = n.label, this.maxZoom = n.maxZoom, this.minZoom = n.minZoom, this.poiTemplate = n.poiTemplate, this.poiStyle = n.poiStyle, this.iconTemplate = n.iconTemplate, this.icon = n.icon, this.selectedIcon = n.selectedIcon, this.mercatorXShift = n.mercatorXShift, this.mercatorYShift = n.mercatorYShift, this.weiwudi = n.weiwudi, n.envelopeLngLats) {
        const o = n.envelopeLngLats.map(
          (g) => Ot(g, "EPSG:4326", "EPSG:3857")
        );
        o.push(o[0]), this.envelope = Ng([o]), this.centroid = rI(this.envelope).geometry?.coordinates;
      }
      for (let s = 0; s < un.length; s++) {
        const o = un[s], g = gI[s];
        this.set(o, n[g] || n[o]);
      }
      const i = n.thumbnail ? new Promise((s) => {
        this.thumbnail = n.thumbnail, s(void 0);
      }) : new Promise((s) => {
        this.thumbnail = `./tmbs/${n.mapID}.jpg`, fetch(this.thumbnail).then((o) => {
          o.ok || (this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`), s(void 0);
        }).catch((o) => {
          this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`, s(void 0);
        });
      }).catch((s) => {
        this.thumbnail = `./tmbs/${n.mapID || n.sourceID}_menu.jpg`;
      }), r = this.resolvePois(n.pois);
      this.initialWait = Promise.all([r, i]), oI(this);
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
      const s = n.mercZoom, o = n.zoom, g = n.direction, a = n.rotation, C = this.getMap(), I = C?.getView(), c = C ? C.getSize() : void 0;
      I && (!c || c[0] <= 0 || c[1] <= 0) || (n.latitude !== void 0 && n.longitude !== void 0 && (i = Ot(
        [n.longitude, n.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), n.x !== void 0 && n.y != null && (r = [n.x, n.y]), this.viewpoint2MercsAsync().then((u) => this.mercs2MercViewpoint(u)).then((u) => {
        const d = this.mercViewpoint2Mercs([
          i || u[0],
          s || u[1] || 17,
          g ?? a ?? u[2]
        ]);
        this.mercs2ViewpointAsync(d).then((f) => {
          i != null ? I?.setCenter(f[0]) : r != null && I?.setCenter(r), s != null ? I?.setZoom(f[1]) : o != null && I?.setZoom(o), g != null ? I?.setRotation(f[2]) : a != null && I?.setRotation(a);
        });
      }));
    }
    setViewpoint(n) {
      const i = { ...n };
      i.rotation && (i.rotation = i.rotation * Math.PI / 180), i.direction && (i.direction = i.direction * Math.PI / 180), this.setViewpointRadian(i);
    }
    goHome() {
      const i = this.getMap();
      let r = i.getTarget();
      typeof r == "string" && (r = document.getElementById(r));
      const s = i.homeMarginPixels, o = [
        (r.clientWidth - s - 10) * 1,
        (r.clientHeight - s - 10) * 1
      ], g = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(o)
      };
      this.getMap().northUp ? g.direction = 0 : g.rotation = 0, this.setViewpointRadian(g);
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
        return new Promise((g, a) => {
          r?.setGPSPosition(null), g(!0);
        });
      const o = this.mercsFromGPSValue(n.lnglat, n.acc);
      return this.mercs2SysCoordsAsync_multiLayer([o]).then((g) => {
        const a = !g[0], C = a ? g[1] : g[0];
        if (!C || !this.insideCheckSysCoord(C[0][0]))
          return r?.setGPSPosition(null), !1;
        const I = a ? null : g[1], c = { xy: C[0][0] }, u = C[0].slice(1);
        return c.rad = u.reduce(
          (d, f, m) => {
            const h = d + Math.sqrt(
              Math.pow(f[0] - c.xy[0], 2) + Math.pow(f[1] - c.xy[1], 2)
            );
            return m === 3 ? h / 4 : h;
          },
          0
        ), i || s?.setCenter(c.xy), r?.setGPSPosition(c, a ? "hide" : null), I && r?.setGPSPosition({ xy: I[0][0] }, "sub"), !0;
      }).catch((g) => {
        throw g;
      });
    }
    setGPSMarker(n, i = !1) {
      this.setGPSMarkerAsync(n, i).then(() => {
      });
    }
    mercsFromGPSValue(n, i) {
      const r = Ot(n, "EPSG:4326", "EPSG:3857"), s = n[1] * Math.PI / 180, o = i / Math.cos(s);
      return Pg.map((g) => [
        g[0] * o + r[0],
        g[1] * o + r[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(n, i) {
      return i === void 0 && (i = this.getMap().getView().getRotation()), xg(n, i);
    }
    async resolvePois(n) {
      this.pois = await Lg(n || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(n) {
      let i;
      return Object.keys(this.pois).map((r) => {
        this.pois[r].pois.map((s, o) => {
          s.id === n && (i = this.pois[r].pois[o]);
        });
      }), i;
    }
    addPoi(n, i) {
      if (i || (i = "main"), this.pois[i])
        return n = cn(n), this.pois[i].pois.push(n), jr(this.pois, i, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), n.namespaceID;
    }
    removePoi(n) {
      Object.keys(this.pois).forEach((i) => {
        const r = this.pois[i].pois;
        for (let s = r.length - 1; s >= 0; s--)
          r[s].id === n && r.splice(s, 1);
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
      n !== "main" && (this.pois[n] || (this.pois[n] = Pe(i || [], n, {
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
      return i === void 0 && (i = this.getMap().getView().getDecimalZoom()), Gr(n, i);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(n, i) {
      return this.mercViewpoint2Mercs(n, i);
    }
    mercViewpoint2Mercs(n, i) {
      let r = n ? n[0] : void 0;
      const s = n ? n[1] : void 0, o = n ? n[2] : void 0;
      r === void 0 && (r = this.getMap().getView().getCenter()), i === void 0 && (i = this.getMap().getSize());
      const g = s ?? this.getMap().getView().getDecimalZoom(), a = o ?? this.getMap().getView().getRotation();
      return [wr(
        r,
        g,
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
      const r = vr(
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
function zg(A) {
  class t extends Zg(A) {
    static isBasemap_ = !0;
    static isWmts_ = !0;
    insideCheckXy(n) {
      return this.envelope ? za(n, this.envelope) : !0;
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(n);
    }
    modulateXyInside(n) {
      if (!this.centroid) return n;
      const i = xa([n, this.centroid]), r = nI(this.envelope, i);
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
function sI(A) {
  class t extends Zg(A) {
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
      const i = n[0] * (2 * V) / this._maxxy - V, r = -1 * (n[1] * (2 * V) / this._maxxy - V);
      return [i, r];
    }
    sysCoord2Xy(n) {
      const i = (n[0] + V) * this._maxxy / (2 * V), r = (-n[1] + V) * this._maxxy / (2 * V);
      return [i, r];
    }
    defZoom(n) {
      const i = n[0], r = n[1], s = Math.log2((i - 10) / this.width), o = Math.log2((r - 10) / this.height), g = this.maxZoom;
      let a;
      return o > s ? a = o : a = s, g + a;
    }
  }
  return t;
}
const un = [
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
], gI = [
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
], Er = (A) => (A || "").match(/^(?:google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre)$/);
function Ug(A) {
  return A = Ae(A), A.imageExtension || (A.imageExtension = "jpg"), Er(A.maptype) ? (delete A.url, delete A.urls) : A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A;
}
function oI(A) {
  const t = A;
  A.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), n = [1e3, 2e3, 4e3], i = /* @__PURE__ */ new WeakMap();
      let r = !1;
      const s = function(g, a) {
        r || (r = !0, console.warn(
          "Maplat: tile composition failed by an exception; retrying (up to 3 times)",
          a
        ));
        const C = i.get(g) ?? 0;
        C >= n.length || (i.set(g, C + 1), setTimeout(() => {
          const I = t.getMap?.()?.getTargetElement?.();
          I && !I.isConnected || g.getState?.() === qo.ERROR && g.load();
        }, n[C]));
      }, o = function(g, a, C, I, c, u, d) {
        return new Promise((f, m) => {
          const h = function(w, S = void 0) {
            const b = document.createElement("img");
            b.crossOrigin = "Anonymous", b.onload = b.onerror = function() {
              try {
                if (b.width && b.height) {
                  const P = C.getContext("2d"), x = I === 0 ? 256 - u : 0, D = c === 0 ? 256 - d : 0;
                  u = I + u > b.width ? b.width - I : u, d = c + d > b.height ? b.height - c : d, P.drawImage(b, I, c, u, d, x, D, u, d), f(void 0);
                } else
                  S ? h(S) : f("tileLoadError");
              } catch {
                f("tileException");
              }
            }, b.src = w;
          };
          h(a);
        });
      };
      return function(g, a) {
        const C = g.tileCoord[0];
        let I = g.tileCoord[1], c = g.tileCoord[2], u = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, C) / V
        ), d = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, C) / V
        );
        for (; u < 0 || u >= 256; )
          u < 0 ? (u = u + 256, I++) : (u = u - 256, I--);
        for (; d < 0 || d >= 256; )
          d < 0 ? (d = d + 256, c++) : (d = d - 256, c--);
        const f = document.createElement("div");
        f.innerHTML = Sa;
        const m = f.childNodes[0], h = [
          [[C, I, c], 0, 0, 256 - u, 256 - d]
        ];
        u !== 0 && h.push([
          [C, I - 1, c],
          256 - u,
          0,
          u,
          256 - d
        ]), d !== 0 && (h.push([
          [C, I, c - 1],
          0,
          256 - d,
          256 - u,
          d
        ]), u !== 0 && h.push([
          [C, I - 1, c - 1],
          256 - u,
          256 - d,
          u,
          d
        ])), Promise.all(
          h.map((w) => {
            const S = t.tileUrlFunction(
              w[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return o(
              w[0],
              S,
              m,
              w[1],
              w[2],
              w[3],
              w[4]
            );
          })
        ).then((w) => {
          if (w.reduce((b, P) => b && P, !0))
            g.handleImageError_(), w.includes("tileException") && s(g);
          else {
            const b = m.toDataURL(), P = g.getImage();
            P.crossOrigin = null, e(g, b), i.delete(g);
          }
        }).catch((w) => {
          g.handleImageError_(), s(g, w);
        });
      };
    })()
  );
}
function $A(A) {
  const t = document, e = t.createDocumentFragment(), n = [];
  A = A.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const i = e.appendChild(t.createElement("div"));
  i.innerHTML = A;
  for (let r = 0; r < i.childNodes.length; r++) {
    const s = i.childNodes[r];
    if (s.nodeName && s.nodeName.toLowerCase() === "script") {
      const o = t.createElement("script");
      s.type && (o.type = s.type), s.src ? o.src = s.src : o.text = s.text, n[r] = o;
    } else
      n[r] = s;
  }
  return n;
}
function ti(A) {
  for (; !(A <= 180 && A > -180); ) {
    const t = A > 0 ? -1 : 1;
    A = A + t * 360;
  }
  return A;
}
function Ss(A) {
  if (!A) return;
  const t = {
    mapID: A.mapID
  };
  for (let e = 0; e < un.length; e++) {
    const n = un[e];
    A[n] && (t[n] = A[n]);
  }
  return t;
}
function Ae(A) {
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
class Fg {
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
function aI(A, t, e) {
  let n, i;
  e = e || Wg;
  let r = 0, s = A.length, o = !1;
  for (; r < s; )
    n = r + (s - r >> 1), i = +e(A[n], t), i < 0 ? r = n + 1 : (s = n, o = !i);
  return o ? r : ~r;
}
function Wg(A, t) {
  return A > t ? 1 : A < t ? -1 : 0;
}
function _g(A, t, e) {
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
function Vg(A, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let i = 0; i < n; i++)
    A[A.length] = e[i];
}
function II(A, t) {
  const e = A.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (A[n] !== t[n])
      return !1;
  return !0;
}
function Mt() {
  throw new Error("Unimplemented abstract method.");
}
let CI = 0;
function cI(A) {
  const t = (
    /** @type {{ol_uid: (string|undefined)}} */
    /** @type {unknown} */
    A
  );
  return t.ol_uid || (t.ol_uid = String(++CI));
}
function lI() {
  return !0;
}
function yi() {
  return !1;
}
function Mr() {
}
function uI(A) {
  let t, e, n;
  return function() {
    const i = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !II(i, e)) && (n = this, e = i, t = A.apply(this, i)), t;
  };
}
function Hg(A) {
  for (const t in A)
    delete A[t];
}
function hI(A) {
  let t;
  for (t in A)
    return !1;
  return !t;
}
class Qg extends Fg {
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
    const r = e ? new de(t) : (
      /** @type {Event} */
      t
    );
    r.target || (r.target = this.eventTarget_ || this);
    const s = this.dispatching_ || (this.dispatching_ = {}), o = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in s || (s[n] = 0, o[n] = 0), ++s[n];
    let g;
    for (let a = 0, C = i.length; a < C; ++a)
      if ("handleEvent" in i[a] ? g = /** @type {import("../events.js").ListenerObject} */
      i[a].handleEvent(r) : g = /** @type {import("../events.js").ListenerFunction} */
      i[a].call(this, r), g === !1 || r.propagationStopped) {
        g = !1;
        break;
      }
    if (--s[n] === 0) {
      let a = o[n];
      for (delete o[n]; a--; )
        this.removeEventListener(n, Mr);
      delete s[n];
    }
    return (
      /** @type {boolean|undefined} */
      g
    );
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && Hg(this.listeners_);
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
    i !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[i] = Mr, ++this.pendingRemovals_[t]) : (n.splice(i, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
Mg.prototype.getDecimalZoom = function() {
  const A = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / A) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const at = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function Xr(A, t, e) {
  let n, i;
  return t < A[0] ? n = A[0] - t : A[2] < t ? n = t - A[2] : n = 0, e < A[1] ? i = A[1] - e : A[3] < e ? i = e - A[3] : i = 0, n * n + i * i;
}
function fI(A, t, e) {
  return A[0] <= t && t <= A[2] && A[1] <= e && e <= A[3];
}
function Ts(A, t) {
  const e = A[0], n = A[1], i = A[2], r = A[3], s = t[0], o = t[1];
  let g = at.UNKNOWN;
  return s < e ? g = g | at.LEFT : s > i && (g = g | at.RIGHT), o < n ? g = g | at.BELOW : o > r && (g = g | at.ABOVE), g === at.UNKNOWN && (g = at.INTERSECTING), g;
}
function Yg() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function wi(A, t, e, n, i) {
  return i ? (i[0] = A, i[1] = t, i[2] = e, i[3] = n, i) : [A, t, e, n];
}
function Kg(A) {
  return wi(1 / 0, 1 / 0, -1 / 0, -1 / 0, A);
}
function dI(A, t) {
  const e = A[0], n = A[1];
  return wi(e, n, e, n, t);
}
function mI(A, t, e, n, i) {
  const r = Kg(i);
  return Jg(r, A, t, e, n);
}
function Jg(A, t, e, n, i) {
  for (; e < n; e += i)
    pI(A, t[e], t[e + 1]);
  return A;
}
function pI(A, t, e) {
  A[0] = Math.min(A[0], t), A[1] = Math.min(A[1], e), A[2] = Math.max(A[2], t), A[3] = Math.max(A[3], e);
}
function qg(A, t) {
  let e;
  return e = t(yI(A)), e || (e = t(wI(A)), e) || (e = t(MI(A)), e) || (e = t(EI(A)), e) ? e : !1;
}
function yI(A) {
  return [A[0], A[1]];
}
function wI(A) {
  return [A[2], A[1]];
}
function Ii(A) {
  return [(A[0] + A[2]) / 2, (A[1] + A[3]) / 2];
}
function vI(A, t, e, n, i) {
  const [r, s, o, g, a, C, I, c] = bI(
    A,
    t,
    e,
    n
  );
  return wi(
    Math.min(r, o, a, I),
    Math.min(s, g, C, c),
    Math.max(r, o, a, I),
    Math.max(s, g, C, c),
    i
  );
}
function bI(A, t, e, n) {
  const i = t * n[0] / 2, r = t * n[1] / 2, s = Math.cos(e), o = Math.sin(e), g = i * s, a = i * o, C = r * s, I = r * o, c = A[0], u = A[1];
  return [
    c - g + I,
    u - a - C,
    c - g - I,
    u - a + C,
    c + g - I,
    u + a + C,
    c + g + I,
    u + a - C,
    c - g + I,
    u - a - C
  ];
}
function hn(A) {
  return A[3] - A[1];
}
function EI(A) {
  return [A[0], A[3]];
}
function MI(A) {
  return [A[2], A[3]];
}
function Zr(A) {
  return A[2] - A[0];
}
function zr(A, t) {
  return A[0] <= t[2] && A[2] >= t[0] && A[1] <= t[3] && A[3] >= t[1];
}
function $g(A) {
  return A[2] < A[0] || A[3] < A[1];
}
function RI(A, t) {
  return t ? (t[0] = A[0], t[1] = A[1], t[2] = A[2], t[3] = A[3], t) : A;
}
function SI(A, t, e) {
  let n = !1;
  const i = Ts(A, t), r = Ts(A, e);
  if (i === at.INTERSECTING || r === at.INTERSECTING)
    n = !0;
  else {
    const s = A[0], o = A[1], g = A[2], a = A[3], C = t[0], I = t[1], c = e[0], u = e[1], d = (u - I) / (c - C);
    let f, m;
    r & at.ABOVE && !(i & at.ABOVE) && (f = c - (u - a) / d, n = f >= s && f <= g), !n && r & at.RIGHT && !(i & at.RIGHT) && (m = u - (c - g) * d, n = m >= o && m <= a), !n && r & at.BELOW && !(i & at.BELOW) && (f = c - (u - o) / d, n = f >= s && f <= g), !n && r & at.LEFT && !(i & at.LEFT) && (m = u - (c - s) * d, n = m >= o && m <= a);
  }
  return n;
}
const TI = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
function pA(A, t, e, n, i) {
  if (i) {
    const s = e;
    e = function(o) {
      return A.removeEventListener(t, e), s.call(n ?? this, o);
    };
  } else n && n !== A && (e = e.bind(n));
  const r = {
    target: A,
    type: t,
    listener: e
  };
  return A.addEventListener(t, e), r;
}
function Ps(A, t, e, n) {
  return pA(A, t, e, n, !0);
}
function Cn(A) {
  A && A.target && (A.target.removeEventListener(A.type, A.listener), Hg(A));
}
const Be = {
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
class vi extends Qg {
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
    ++this.revision_, this.dispatchEvent(Be.CHANGE);
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
        i[r] = pA(this, t[r], e);
      return i;
    }
    return pA(
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
        n[r] = Ps(this, t[r], e);
    } else
      n = Ps(
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
      PI(n);
    else if (Array.isArray(t))
      for (let i = 0, r = t.length; i < r; ++i)
        this.removeEventListener(t[i], e);
    else
      this.removeEventListener(t, e);
  }
}
vi.prototype.on;
vi.prototype.once;
vi.prototype.un;
function PI(A) {
  if (Array.isArray(A))
    for (let t = 0, e = A.length; t < e; ++t)
      Cn(A[t]);
  else
    Cn(
      /** @type {import("./events.js").EventsKey} */
      A
    );
}
class xs extends de {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class PA extends vi {
  /**
   * @param {NoInfer<Properties>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, cI(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new xs(n, t, e)), n = TI.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new xs(n, t, e));
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
    const i = (
      /** @type {Object<string, *>} */
      this.values_ || (this.values_ = /** @type {Partial<NoInfer<Properties>>} */
      {})
    );
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
      delete this.values_[t], hI(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
function xI(...A) {
  console.warn(...A);
}
function _t(A, t, e) {
  return Math.min(Math.max(A, t), e);
}
function DI(A, t, e, n, i, r) {
  const s = i - e, o = r - n;
  if (s !== 0 || o !== 0) {
    const g = ((A - e) * s + (t - n) * o) / (s * s + o * o);
    g > 1 ? (e = i, n = r) : g > 0 && (e += s * g, n += o * g);
  }
  return yA(A, t, e, n);
}
function yA(A, t, e, n) {
  const i = e - A, r = n - t;
  return i * i + r * r;
}
function Ds(A) {
  return A * 180 / Math.PI;
}
function wA(A) {
  return A * Math.PI / 180;
}
function Rr(A, t) {
  const e = A % t;
  return e * t < 0 ? e + t : e;
}
function Ur(A, t, e) {
  return A + e * (t - A);
}
function Sr(A, t, e) {
  if (A >= t && A < e)
    return A;
  const n = e - t;
  return ((A - t) % n + n) % n + t;
}
function BI(A, t) {
  return A[0] += +t[0], A[1] += +t[1], A;
}
function Ci(A, t) {
  let e = !0;
  for (let n = A.length - 1; n >= 0; --n)
    if (A[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function Fr(A, t) {
  const e = Math.cos(t), n = Math.sin(t), i = A[0] * e - A[1] * n, r = A[1] * e + A[0] * n;
  return A[0] = i, A[1] = r, A;
}
function OI(A, t) {
  return A[0] *= t, A[1] *= t, A;
}
const to = {
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
    return this.metersPerUnit_ || to[this.units_];
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
const En = 6378137, mA = Math.PI * En, LI = [-mA, -mA, mA, mA], kI = [-180, -85, 180, 85], ei = En * Math.log(Math.tan(Math.PI / 2));
class cA extends fn {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: LI,
      global: !0,
      worldExtent: kI,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / En);
      }
    });
  }
}
const Bs = [
  new cA("EPSG:3857"),
  new cA("EPSG:102100"),
  new cA("EPSG:102113"),
  new cA("EPSG:900913"),
  new cA("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new cA("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function NI(A, t, e, n) {
  const i = A.length;
  e = e !== void 0 && e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(i));
  for (let r = 0; r < i; r += n) {
    t[r] = mA * A[r] / 180;
    let s = En * Math.log(Math.tan(Math.PI * (+A[r + 1] + 90) / 360));
    s > ei ? s = ei : s < -ei && (s = -ei), t[r + 1] = s;
  }
  return t;
}
function GI(A, t, e, n) {
  const i = A.length;
  e = e !== void 0 && e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(i));
  for (let r = 0; r < i; r += n)
    t[r] = 180 * A[r] / mA, t[r + 1] = 360 * Math.atan(Math.exp(A[r + 1] / En)) / Math.PI - 90;
  return t;
}
const jI = 6378137, Os = [-180, -90, 180, 90], XI = Math.PI * jI / 180;
class je extends fn {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: Os,
      axisOrientation: e,
      global: !0,
      metersPerUnit: XI,
      worldExtent: Os
    });
  }
}
const Ls = [
  new je("CRS:84"),
  new je("EPSG:4326", "neu"),
  new je("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new je("urn:ogc:def:crs:OGC:2:84"),
  new je("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new je("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new je("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let Tr = {};
function ZI(A) {
  return Tr[A] || Tr[A.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function zI(A, t) {
  Tr[A] = t;
}
let vA = {};
function dn(A, t, e) {
  const n = A.getCode(), i = t.getCode();
  n in vA || (vA[n] = {}), vA[n][i] = e;
}
function Ji(A, t) {
  return A in vA && t in vA[A] ? vA[A][t] : null;
}
const ci = 0.9996, jt = 669438e-8, bi = jt * jt, Ei = bi * jt, We = jt / (1 - jt), ks = Math.sqrt(1 - jt), SA = (1 - ks) / (1 + ks), eo = SA * SA, Wr = eo * SA, _r = Wr * SA, Ao = _r * SA, no = 1 - jt / 4 - 3 * bi / 64 - 5 * Ei / 256, UI = 3 * jt / 8 + 3 * bi / 32 + 45 * Ei / 1024, FI = 15 * bi / 256 + 45 * Ei / 1024, WI = 35 * Ei / 3072, _I = 3 / 2 * SA - 27 / 32 * Wr + 269 / 512 * Ao, VI = 21 / 16 * eo - 55 / 32 * _r, HI = 151 / 96 * Wr - 417 / 128 * Ao, QI = 1097 / 512 * _r, li = 6378137;
function YI(A, t, e) {
  const n = A - 5e5, s = (e.north ? t : t - 1e7) / ci / (li * no), o = s + _I * Math.sin(2 * s) + VI * Math.sin(4 * s) + HI * Math.sin(6 * s) + QI * Math.sin(8 * s), g = Math.sin(o), a = g * g, C = Math.cos(o), I = g / C, c = I * I, u = c * c, d = 1 - jt * a, f = Math.sqrt(1 - jt * a), m = li / f, h = (1 - jt) / d, w = We * C ** 2, S = w * w, b = n / (m * ci), P = b * b, x = P * b, D = x * b, B = D * b, X = B * b, j = o - I / h * (P / 2 - D / 24 * (5 + 3 * c + 10 * w - 4 * S - 9 * We)) + X / 720 * (61 + 90 * c + 298 * w + 45 * u - 252 * We - 3 * S);
  let k = (b - x / 6 * (1 + 2 * c + w) + B / 120 * (5 - 2 * w + 28 * c - 3 * S + 8 * We + 24 * u)) / C;
  return k = Sr(
    k + wA(io(e.number)),
    -Math.PI,
    Math.PI
  ), [Ds(k), Ds(j)];
}
const Ns = -80, Gs = 84, KI = -180, JI = 180;
function qI(A, t, e) {
  A = Sr(A, KI, JI), t < Ns ? t = Ns : t > Gs && (t = Gs);
  const n = wA(t), i = Math.sin(n), r = Math.cos(n), s = i / r, o = s * s, g = o * o, a = wA(A), C = io(e.number), I = wA(C), c = li / Math.sqrt(1 - jt * i ** 2), u = We * r ** 2, d = r * Sr(a - I, -Math.PI, Math.PI), f = d * d, m = f * d, h = m * d, w = h * d, S = w * d, b = li * (no * n - UI * Math.sin(2 * n) + FI * Math.sin(4 * n) - WI * Math.sin(6 * n)), P = ci * c * (d + m / 6 * (1 - o + u) + w / 120 * (5 - 18 * o + g + 72 * u - 58 * We)) + 5e5;
  let x = ci * (b + c * s * (f / 2 + h / 24 * (5 - o + 9 * u + 4 * u ** 2) + S / 720 * (61 - 58 * o + g + 600 * u - 330 * We)));
  return e.north || (x += 1e7), [P, x];
}
function io(A) {
  return (A - 1) * 6 - 180 + 3;
}
const $I = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function ro(A) {
  let t = 0;
  for (const i of $I) {
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
function js(A, t) {
  return function(e, n, i, r) {
    const s = e.length;
    i = i !== void 0 && i > 1 ? i : 2, r = r ?? i, n || (i > 2 ? n = e.slice() : n = new Array(s));
    for (let o = 0; o < s; o += r) {
      const g = e[o], a = e[o + 1], C = A(g, a, t);
      n[o] = C[0], n[o + 1] = C[1];
    }
    return n;
  };
}
function tC(A) {
  return ro(A) ? new fn({ code: A, units: "m" }) : null;
}
function eC(A) {
  const t = ro(A.getCode());
  return t ? {
    forward: js(qI, t),
    inverse: js(YI, t)
  } : null;
}
const AC = [eC], nC = [tC];
let Pr = !0;
function iC(A) {
  Pr = !1;
}
function so(A, t) {
  if (t !== void 0) {
    for (let e = 0, n = A.length; e < n; ++e)
      t[e] = A[e];
    t = t;
  } else
    t = A.slice();
  return t;
}
function xr(A) {
  zI(A.getCode(), A), dn(A, A, so);
}
function rC(A) {
  A.forEach(xr);
}
function mn(A) {
  if (typeof A != "string")
    return A !== void 0 ? A : null;
  const t = ZI(A);
  if (t)
    return t;
  for (const e of nC) {
    const n = e(A);
    if (n)
      return n;
  }
  return null;
}
function Xs(A) {
  rC(A), A.forEach(function(t) {
    A.forEach(function(e) {
      t !== e && dn(t, e, so);
    });
  });
}
function sC(A, t, e, n) {
  A.forEach(function(i) {
    t.forEach(function(r) {
      dn(i, r, e), dn(r, i, n);
    });
  });
}
function Vr(A, t) {
  return A ? typeof A == "string" ? mn(A) : (
    /** @type {Projection} */
    A
  ) : mn(t);
}
function gC(A, t) {
  if (!A || !t)
    return null;
  const e = A.getCode(), n = t.getCode();
  let i = Ji(e, n);
  if (i)
    return i;
  let r = null, s = null;
  for (const g of AC)
    r || (r = g(A)), s || (s = g(t));
  if (!r && !s)
    return null;
  const o = "EPSG:4326";
  if (!s && r) {
    const g = Ji(o, n);
    g && (i = qi(
      r.inverse,
      g
    ));
  } else if (!r && s) {
    const g = Ji(e, o);
    g && (i = qi(
      g,
      s.forward
    ));
  } else r && s && (i = qi(
    r.inverse,
    s.forward
  ));
  return i && (xr(A), xr(t), dn(A, t, i)), i;
}
function qi(A, t) {
  return function(e, n, i, r) {
    return n = A(e, n, i, r), t(n, n, i, r);
  };
}
function Zs(A, t) {
  const e = mn(A), n = mn(t);
  return gC(e, n);
}
let oC = null;
function aC() {
  return oC;
}
function zs(A, t) {
  return A;
}
function Re(A, t) {
  return Pr && !Ci(A, [0, 0]) && A[0] >= -180 && A[0] <= 180 && A[1] >= -90 && A[1] <= 90 && (Pr = !1, xI(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), A;
}
function IC(A, t) {
  return A;
}
function Ai(A, t) {
  return A;
}
function CC() {
  Xs(Bs), Xs(Ls), sC(
    Ls,
    Bs,
    NI,
    GI
  );
}
CC();
function xe(A, t) {
  if (!A)
    throw new Error(t);
}
const cC = [1, 0, 0, 1, 0, 0];
new Array(6);
function lC() {
  return cC.slice(0);
}
function uC(A, t, e, n, i, r, s, o) {
  const g = Math.sin(r), a = Math.cos(r);
  return A[0] = n * a, A[1] = i * g, A[2] = -n * g, A[3] = i * a, A[4] = s * n * a - o * n * g + t, A[5] = s * i * g + o * i * a + e, A;
}
function hC(A, t, e, n, i, r, s) {
  r = r || [], s = s || 2;
  let o = 0;
  for (let g = t; g < e; g += n) {
    const a = A[g], C = A[g + 1];
    r[o++] = i[0] * a + i[2] * C + i[4], r[o++] = i[1] * a + i[3] * C + i[5];
    for (let I = 2; I < s; I++)
      r[o++] = A[g + I];
  }
  return r && r.length != o && (r.length = o), r;
}
function go(A, t, e, n, i, r, s) {
  s = s || [];
  const o = Math.cos(i), g = Math.sin(i), a = r[0], C = r[1];
  let I = 0;
  for (let c = t; c < e; c += n) {
    const u = A[c] - a, d = A[c + 1] - C;
    s[I++] = a + u * o - d * g, s[I++] = C + u * g + d * o;
    for (let f = c + 2; f < c + n; ++f)
      s[I++] = A[f];
  }
  return s && s.length != I && (s.length = I), s;
}
function fC(A, t, e, n, i, r, s, o) {
  o = o || [];
  const g = s[0], a = s[1];
  let C = 0;
  for (let I = t; I < e; I += n) {
    const c = A[I] - g, u = A[I + 1] - a;
    o[C++] = g + i * c, o[C++] = a + r * u;
    for (let d = I + 2; d < I + n; ++d)
      o[C++] = A[d];
  }
  return o && o.length != C && (o.length = C), o;
}
function dC(A, t, e, n, i, r, s) {
  s = s || [];
  let o = 0;
  for (let g = t; g < e; g += n) {
    s[o++] = A[g] + i, s[o++] = A[g + 1] + r;
    for (let a = g + 2; a < g + n; ++a)
      s[o++] = A[a];
  }
  return s && s.length != o && (s.length = o), s;
}
const Us = lC(), mC = [NaN, NaN];
class pC extends PA {
  constructor() {
    super(), this.extent_ = Yg(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = uI(
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
  closestPointXY(t, e, n, i) {
    return Mt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, mC, Number.MIN_VALUE) === 0;
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
      (isNaN(e[0]) || isNaN(e[1])) && Kg(e), this.extentRevision_ = this.getRevision();
    }
    return RI(this.extent_, t);
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
    const n = mn(t);
    if (!n)
      return this;
    const i = n.getUnits() == "tile-pixels" ? (
      /**
       * @param {Array<number>} inCoordinates Input coordinates.
       * @param {Array<number>} outCoordinates Output coordinates.
       * @param {number} stride Stride.
       * @return {Array<number>} Output coordinates.
       */
      function(r, s, o) {
        const g = n.getExtent(), a = n.getWorldExtent(), C = hn(a) / hn(g);
        uC(
          Us,
          a[0],
          a[3],
          C,
          -C,
          0,
          0,
          0
        );
        const I = hC(
          r,
          0,
          r.length,
          o,
          Us,
          s
        ), c = Zs(n, e);
        return c ? c(I, I, o) : I;
      }
    ) : Zs(n, e);
    return i && this.applyTransform(
      /** @type {import("../proj.js").TransformFunction} */
      i
    ), this;
  }
}
class Mn extends pC {
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
    return mI(
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
    this.stride = Fs(t), this.layout = t, this.flatCoordinates = e;
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
    let i;
    if (t)
      i = Fs(t);
    else {
      for (let r = 0; r < n; ++r) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      i = e.length, t = yC(i);
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
      go(
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
    e === void 0 && (e = t), n || (n = Ii(this.getExtent()));
    const i = this.getFlatCoordinates();
    if (i) {
      const r = this.getStride();
      fC(
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
      dC(
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
function yC(A) {
  let t;
  return A == 2 ? t = "XY" : A == 3 ? t = "XYZ" : A == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function Fs(A) {
  let t;
  return A == "XY" ? t = 2 : A == "XYZ" || A == "XYM" ? t = 3 : A == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function oo(A, t, e, n) {
  for (let i = 0; i < n; ++i)
    A[t++] = e[i];
  return t;
}
function Hr(A, t, e, n) {
  for (let i = 0, r = e.length; i < r; ++i) {
    const s = e[i];
    for (let o = 0; o < n; ++o)
      A[t++] = s[o];
  }
  return t;
}
function wC(A, t, e, n, i) {
  i = i || [];
  let r = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const g = Hr(
      A,
      t,
      e[s],
      n
    );
    i[r++] = g, t = g;
  }
  return i.length = r, i;
}
class Qr extends Mn {
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
    const t = new Qr(
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
    const r = this.flatCoordinates, s = t - r[0], o = e - r[1], g = s * s + o * o;
    if (g < i) {
      if (g === 0)
        for (let a = 0; a < this.stride; ++a)
          n[a] = r[a];
      else {
        const a = this.getRadius() / Math.sqrt(g);
        n[0] = r[0] + a * s, n[1] = r[1] + a * o;
        for (let C = 2; C < this.stride; ++C)
          n[C] = r[C];
      }
      return n.length = this.stride, g;
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
    return wi(
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
    if (zr(t, e)) {
      const n = this.getCenter();
      return t[0] <= n[0] && t[2] >= n[0] || t[1] <= n[1] && t[3] >= n[1] ? !0 : qg(t, this.intersectsCoordinate.bind(this));
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
    let r = oo(i, 0, t, this.stride);
    i[r++] = i[0] + e;
    for (let s = 1, o = this.stride; s < o; ++s)
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
    const n = this.getCenter(), i = this.getStride();
    this.setCenter(
      go(n, 0, n.length, i, t, e, n)
    ), this.changed();
  }
}
function ao(A, t, e, n) {
  let i = 0;
  const r = A[e - n], s = A[e - n + 1];
  let o = 0, g = 0;
  for (; t < e; t += n) {
    const a = A[t] - r, C = A[t + 1] - s;
    i += g * a - o * C, o = a, g = C;
  }
  return i / 2;
}
function vC(A, t, e, n) {
  let i = 0;
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r];
    i += ao(A, t, o, n), t = o;
  }
  return i;
}
function Ws(A, t, e, n, i, r, s) {
  const o = A[t], g = A[t + 1], a = A[e] - o, C = A[e + 1] - g;
  let I;
  if (a === 0 && C === 0)
    I = t;
  else {
    const c = ((i - o) * a + (r - g) * C) / (a * a + C * C);
    if (c > 1)
      I = e;
    else if (c > 0) {
      for (let u = 0; u < n; ++u)
        s[u] = Ur(
          A[t + u],
          A[e + u],
          c
        );
      s.length = n;
      return;
    } else
      I = t;
  }
  for (let c = 0; c < n; ++c)
    s[c] = A[I + c];
  s.length = n;
}
function Yr(A, t, e, n, i) {
  let r = A[t], s = A[t + 1];
  for (t += n; t < e; t += n) {
    const o = A[t], g = A[t + 1], a = yA(r, s, o, g);
    a > i && (i = a), r = o, s = g;
  }
  return i;
}
function bC(A, t, e, n, i) {
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r];
    i = Yr(A, t, o, n, i), t = o;
  }
  return i;
}
function Kr(A, t, e, n, i, r, s, o, g, a, C) {
  if (t == e)
    return a;
  let I, c;
  if (i === 0) {
    if (c = yA(
      s,
      o,
      A[t],
      A[t + 1]
    ), c < a) {
      for (I = 0; I < n; ++I)
        g[I] = A[t + I];
      return g.length = n, c;
    }
    return a;
  }
  C = C || [NaN, NaN];
  let u = t + n;
  for (; u < e; )
    if (Ws(
      A,
      u - n,
      u,
      n,
      s,
      o,
      C
    ), c = yA(s, o, C[0], C[1]), c < a) {
      for (a = c, I = 0; I < n; ++I)
        g[I] = C[I];
      g.length = n, u += n;
    } else
      u += n * Math.max(
        (Math.sqrt(c) - Math.sqrt(a)) / i | 0,
        1
      );
  if (r && (Ws(
    A,
    e - n,
    t,
    n,
    s,
    o,
    C
  ), c = yA(s, o, C[0], C[1]), c < a)) {
    for (a = c, I = 0; I < n; ++I)
      g[I] = C[I];
    g.length = n;
  }
  return a;
}
function EC(A, t, e, n, i, r, s, o, g, a, C) {
  C = C || [NaN, NaN];
  for (let I = 0, c = e.length; I < c; ++I) {
    const u = e[I];
    a = Kr(
      A,
      t,
      u,
      n,
      i,
      r,
      s,
      o,
      g,
      a,
      C
    ), t = u;
  }
  return a;
}
function Jr(A, t, e, n, i) {
  i = i !== void 0 ? i : [];
  let r = 0;
  for (let s = t; s < e; s += n)
    i[r++] = A.slice(s, s + n);
  return i.length = r, i;
}
function MC(A, t, e, n, i) {
  i = i !== void 0 ? i : [];
  let r = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const g = e[s];
    i[r++] = Jr(
      A,
      t,
      g,
      n,
      i[r]
    ), t = g;
  }
  return i.length = r, i;
}
function RC(A, t, e, n, i) {
  return !qg(
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(s) {
      return !_e(
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
function _e(A, t, e, n, i, r) {
  let s = 0, o = A[e - n], g = A[e - n + 1];
  for (; t < e; t += n) {
    const a = A[t], C = A[t + 1];
    g <= r ? C > r && (a - o) * (r - g) - (i - o) * (C - g) > 0 && s++ : C <= r && (a - o) * (r - g) - (i - o) * (C - g) < 0 && s--, o = a, g = C;
  }
  return s !== 0;
}
function Io(A, t, e, n, i, r) {
  if (e.length === 0 || !_e(A, t, e[0], n, i, r))
    return !1;
  for (let s = 1, o = e.length; s < o; ++s)
    if (_e(A, e[s - 1], e[s], n, i, r))
      return !1;
  return !0;
}
function Co(A, t, e, n, i) {
  let r;
  for (t += n; t < e; t += n)
    if (r = i(
      A.slice(t - n, t),
      A.slice(t, t + n)
    ), r)
      return r;
  return !1;
}
function Mi(A, t, e, n, i, r) {
  return r = r ?? Jg(Yg(), A, t, e, n), zr(i, r) ? r[0] >= i[0] && r[2] <= i[2] || r[1] >= i[1] && r[3] <= i[3] ? !0 : Co(
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
    function(s, o) {
      return SI(i, s, o);
    }
  ) : !1;
}
function SC(A, t, e, n, i) {
  return !!(Mi(A, t, e, n, i) || _e(
    A,
    t,
    e,
    n,
    i[0],
    i[1]
  ) || _e(
    A,
    t,
    e,
    n,
    i[0],
    i[3]
  ) || _e(
    A,
    t,
    e,
    n,
    i[2],
    i[1]
  ) || _e(
    A,
    t,
    e,
    n,
    i[2],
    i[3]
  ));
}
function TC(A, t, e, n, i) {
  if (!SC(A, t, e[0], n, i))
    return !1;
  if (e.length === 1)
    return !0;
  for (let r = 1, s = e.length; r < s; ++r)
    if (RC(
      A,
      e[r - 1],
      e[r],
      n,
      i
    ) && !Mi(
      A,
      e[r - 1],
      e[r],
      n,
      i
    ))
      return !1;
  return !0;
}
function co(A, t, e, n, i, r, s) {
  const o = (e - t) / n;
  if (o < 3) {
    for (; t < e; t += n)
      r[s++] = A[t], r[s++] = A[t + 1];
    return s;
  }
  const g = new Array(o);
  g[0] = 1, g[o - 1] = 1;
  const a = [t, e - n];
  let C = 0;
  for (; a.length > 0; ) {
    const I = (
      /** @type {number} */
      a.pop()
    ), c = (
      /** @type {number} */
      a.pop()
    );
    let u = 0;
    const d = A[c], f = A[c + 1], m = A[I], h = A[I + 1];
    for (let w = c + n; w < I; w += n) {
      const S = A[w], b = A[w + 1], P = DI(S, b, d, f, m, h);
      P > u && (C = w, u = P);
    }
    u > i && (g[(C - t) / n] = 1, c + n < C && a.push(c, C), C + n < I && a.push(C, I));
  }
  for (let I = 0; I < o; ++I)
    g[I] && (r[s++] = A[t + I * n], r[s++] = A[t + I * n + 1]);
  return s;
}
function lA(A, t) {
  return t * Math.round(A / t);
}
function PC(A, t, e, n, i, r, s) {
  if (t == e)
    return s;
  let o = lA(A[t], i), g = lA(A[t + 1], i);
  t += n, r[s++] = o, r[s++] = g;
  let a, C;
  do
    if (a = lA(A[t], i), C = lA(A[t + 1], i), t += n, t == e)
      return r[s++] = a, r[s++] = C, s;
  while (a == o && C == g);
  for (; t < e; ) {
    const I = lA(A[t], i), c = lA(A[t + 1], i);
    if (t += n, I == a && c == C)
      continue;
    const u = a - o, d = C - g, f = I - o, m = c - g;
    if (u * m == d * f && (u < 0 && f < u || u == f || u > 0 && f > u) && (d < 0 && m < d || d == m || d > 0 && m > d)) {
      a = I, C = c;
      continue;
    }
    r[s++] = a, r[s++] = C, o = a, g = C, a = I, C = c;
  }
  return r[s++] = a, r[s++] = C, s;
}
function xC(A, t, e, n, i, r, s, o) {
  for (let g = 0, a = e.length; g < a; ++g) {
    const C = e[g];
    s = PC(
      A,
      t,
      C,
      n,
      i,
      r,
      s
    ), o.push(s), t = C;
  }
  return s;
}
class pn extends Mn {
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
  closestPointXY(t, e, n, i) {
    return i < Xr(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Yr(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Kr(
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
    return ao(
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
    return Jr(
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
    return e.length = co(
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
    return Mi(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Hr(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function DC(A, t, e, n, i, r, s) {
  let o, g;
  const a = (e - t) / n;
  if (a === 1)
    o = t;
  else if (a === 2)
    o = t, g = i;
  else if (a !== 0) {
    let C = A[t], I = A[t + 1], c = 0;
    const u = [0];
    for (let m = t + n; m < e; m += n) {
      const h = A[m], w = A[m + 1];
      c += Math.sqrt((h - C) * (h - C) + (w - I) * (w - I)), u.push(c), C = h, I = w;
    }
    const d = i * c, f = aI(u, d);
    f < 0 ? (g = (d - u[-f - 2]) / (u[-f - 1] - u[-f - 2]), o = t + (-f - 2) * n) : o = t + f * n;
  }
  s = s !== void 0 && s > 1 ? s : 2, r = r || new Array(s);
  for (let C = 0; C < s; ++C)
    r[C] = o === void 0 ? NaN : g === void 0 ? A[o + C] : Ur(A[o + C], A[o + n + C], g);
  return r;
}
function BC(A, t, e, n, i, r) {
  if (e == t)
    return null;
  let s;
  if (i < A[t + n - 1])
    return r ? (s = A.slice(t, t + n), s[n - 1] = i, s) : null;
  if (A[e - 1] < i)
    return r ? (s = A.slice(e - n, e), s[n - 1] = i, s) : null;
  if (i == A[t + n - 1])
    return A.slice(t, t + n);
  let o = t / n, g = e / n;
  for (; o < g; ) {
    const c = o + g >> 1;
    i < A[(c + 1) * n - 1] ? g = c : o = c + 1;
  }
  const a = A[o * n - 1];
  if (i == a)
    return A.slice((o - 1) * n, (o - 1) * n + n);
  const C = A[(o + 1) * n - 1], I = (i - a) / (C - a);
  s = [];
  for (let c = 0; c < n - 1; ++c)
    s.push(
      Ur(
        A[(o - 1) * n + c],
        A[o * n + c],
        I
      )
    );
  return s.push(i), s;
}
function OC(A, t, e, n) {
  let i = A[t], r = A[t + 1], s = 0;
  for (let o = t + n; o < e; o += n) {
    const g = A[o], a = A[o + 1];
    s += Math.sqrt((g - i) * (g - i) + (a - r) * (a - r)), i = g, r = a;
  }
  return s;
}
class ui extends Mn {
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
    Vg(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new ui(
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
    return i < Xr(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Yr(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Kr(
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
    return Co(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, BC(
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
    return Jr(
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
    return DC(
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
    return OC(
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
    return e.length = co(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new ui(e, "XY");
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
    return Mi(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Hr(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class yn extends Mn {
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
    const t = new yn(this.flatCoordinates.slice(), this.layout);
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
    const r = this.flatCoordinates, s = yA(
      t,
      e,
      r[0],
      r[1]
    );
    if (s < i) {
      const o = this.stride;
      for (let g = 0; g < o; ++g)
        n[g] = r[g];
      return n.length = o, s;
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
    return dI(this.flatCoordinates, t);
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
    return fI(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = oo(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function LC(A, t, e, n, i, r, s) {
  let o, g, a, C, I, c, u;
  const d = i[r + 1], f = [];
  for (let w = 0, S = e.length; w < S; ++w) {
    const b = e[w];
    for (C = A[b - n], c = A[b - n + 1], o = t; o < b; o += n)
      I = A[o], u = A[o + 1], (d <= c && u <= d || c <= d && d <= u) && (a = (d - c) / (u - c) * (I - C) + C, f.push(a)), C = I, c = u;
  }
  let m = NaN, h = -1 / 0;
  for (f.sort(Wg), C = f[0], o = 1, g = f.length; o < g; ++o) {
    I = f[o];
    const w = Math.abs(I - C);
    w > h && (a = (C + I) / 2, Io(A, t, e, n, a, d) && (m = a, h = w)), C = I;
  }
  return isNaN(m) && (m = i[r]), [m, d, h];
}
function kC(A, t, e, n) {
  for (; t < e - n; ) {
    for (let i = 0; i < n; ++i) {
      const r = A[t + i];
      A[t + i] = A[e - n + i], A[e - n + i] = r;
    }
    t += n, e -= n;
  }
}
function lo(A, t, e, n) {
  let i = 0, r = A[e - n], s = A[e - n + 1];
  for (; t < e; t += n) {
    const o = A[t], g = A[t + 1];
    i += (o - r) * (g + s), r = o, s = g;
  }
  return i === 0 ? void 0 : i > 0;
}
function NC(A, t, e, n, i) {
  i = i !== void 0 ? i : !1;
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r], g = lo(
      A,
      t,
      o,
      n
    );
    if (r === 0) {
      if (i && g || !i && !g)
        return !1;
    } else if (i && !g || !i && g)
      return !1;
    t = o;
  }
  return !0;
}
function _s(A, t, e, n, i) {
  i = i !== void 0 ? i : !1;
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r], g = lo(
      A,
      t,
      o,
      n
    );
    (r === 0 ? i && g || !i && !g : i && !g || !i && g) && kC(A, t, o, n), t = o;
  }
  return t;
}
class Ve extends Mn {
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
    this.flatCoordinates ? Vg(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Ve(
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
    return i < Xr(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      bC(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), EC(
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
    return Io(
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
    return vC(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), _s(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, MC(e, 0, this.ends_, this.stride);
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
      const t = Ii(this.getExtent());
      this.flatInteriorPoint_ = LC(
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
    return new yn(this.getFlatInteriorPoint(), "XYM");
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
    const t = this.layout, e = this.flatCoordinates, n = this.ends_, i = [];
    let r = 0;
    for (let s = 0, o = n.length; s < o; ++s) {
      const g = n[s], a = new pn(
        e.slice(r, g),
        t
      );
      i.push(a), r = g;
    }
    return i;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      NC(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = _s(
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
    return e.length = xC(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new Ve(e, "XY", n);
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
    return TC(
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
    const n = wC(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function Vs(A) {
  if ($g(A))
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
  return new Ve(r, "XY", [r.length]);
}
class TA extends zg(Rg) {
  constructor(t = {}) {
    const e = Ug(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const n = this.getTileUrlFunction();
      this.setTileUrlFunction((i, r, s) => n(i, r, s));
    }
    this.initialize(t);
  }
}
class hi extends TA {
  style = "";
  accessToken = "";
  mapboxMap;
  static isMapbox_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style, this.mapboxMap = t.mapboxMap, this.accessToken = t.accessToken;
  }
}
class fi extends TA {
  style = "";
  maplibreMap;
  static isMapLibre_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = t.maplibreMap;
  }
}
function GC(A, t) {
  const n = A ? {
    google_roadmap: { mapType: "roadmap", derivedLayers: [] },
    google_satellite: { mapType: "satellite", derivedLayers: [] },
    google_hybrid: { mapType: "satellite", derivedLayers: ["layerRoadmap"] },
    google_terrain: { mapType: "terrain", derivedLayers: ["layerRoadmap"] }
  }[A] : void 0, i = n?.mapType ?? "roadmap", r = n?.derivedLayers ?? [], s = (t || []).map(
    (g) => `layer${g.charAt(0).toUpperCase()}${g.slice(1).toLowerCase()}`
  ), o = new Set(r);
  for (const g of s) o.add(g);
  return { mapType: i, layerTypes: [...o] };
}
class Dr extends zg(Qo) {
  constructor(t = {}) {
    const e = Object.assign({}, t), { mapType: n, layerTypes: i } = GC(t.maptype, t.layers);
    e.mapType = n, e.layerTypes = i, super(e), t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const Se = {
  ANIMATING: 0,
  INTERACTING: 1
}, Wt = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function Hs(A, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(n, i, r, s, o) {
      if (!n)
        return;
      if (!i && !t)
        return n;
      const g = t ? 0 : r[0] * (i ?? 0), a = t ? 0 : r[1] * (i ?? 0), C = o ? o[0] : 0, I = o ? o[1] : 0;
      let c = A[0] + g / 2 + C, u = A[2] - g / 2 + C, d = A[1] + a / 2 + I, f = A[3] - a / 2 + I;
      c > u && (c = (u + c) / 2, u = c), d > f && (d = (f + d) / 2, f = d);
      let m = _t(n[0], c, u), h = _t(n[1], d, f);
      if (s && e && i) {
        const w = 30 * i;
        m += -w * Math.log(1 + Math.max(0, c - n[0]) / w) + w * Math.log(1 + Math.max(0, n[0] - u) / w), h += -w * Math.log(1 + Math.max(0, d - n[1]) / w) + w * Math.log(1 + Math.max(0, n[1] - f) / w);
      }
      return [m, h];
    })
  );
}
function jC(A) {
  return A;
}
function XC(A) {
  return Math.pow(A, 3);
}
function Ri(A) {
  return 1 - XC(1 - A);
}
function ZC(A) {
  return 3 * A * A - 2 * A * A * A;
}
function zC(A) {
  return A;
}
function qr(A, t, e, n) {
  const i = Zr(t) / e[0], r = hn(t) / e[1];
  return n ? Math.min(A, Math.max(i, r)) : Math.min(A, Math.min(i, r));
}
function $r(A, t, e) {
  let n = Math.min(A, t);
  const i = 50;
  return n *= Math.log(1 + i * Math.max(0, A / t - 1)) / i + 1, e && (n = Math.max(n, e), n /= Math.log(1 + i * Math.max(0, e / A - 1)) / i + 1), _t(n, e / 2, t * 2);
}
function UC(A, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(i, r, s, o) {
    if (i !== void 0) {
      const g = A[0], a = A[A.length - 1], C = e ? qr(
        g,
        e,
        s,
        !!n
      ) : g;
      if (o)
        return t ? $r(
          i,
          C,
          a
        ) : _t(i, a, C);
      const I = Math.min(C, i), c = Math.floor(_g(A, I, r));
      return A[c] > C && c < A.length - 1 ? A[c + 1] : A[c];
    }
  });
}
function FC(A, t, e, n, i, r) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, o, g, a) {
    if (s !== void 0) {
      const C = i ? qr(
        t,
        i,
        g,
        !!r
      ) : t;
      if (a)
        return n ? $r(
          s,
          C,
          e
        ) : _t(s, e, C);
      const I = 1e-9, c = Math.ceil(
        Math.log(t / C) / Math.log(A) - I
      ), u = -o * (0.5 - I) + 0.5, d = Math.min(C, s), f = Math.floor(
        Math.log(t / d) / Math.log(A) + u
      ), m = Math.max(c, f), h = t / Math.pow(A, m);
      return _t(h, e, C);
    }
  });
}
function Qs(A, t, e, n, i) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, o, g) {
    if (r !== void 0) {
      const a = n ? qr(
        A,
        n,
        o,
        !!i
      ) : A;
      return !e || !g ? _t(r, t, a) : $r(
        r,
        a,
        t
      );
    }
  });
}
function ts(A) {
  if (A !== void 0)
    return 0;
}
function Ys(A) {
  if (A !== void 0)
    return A;
}
function WC(A) {
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
function _C(A) {
  const t = wA(5);
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
const VC = 256, $i = 0;
class Ks extends PA {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = Vr(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && iC(), t.center && (t.center = Re(
      t.center,
      /** @type {import("./proj.js").ProjectionLike} */
      this.projection_
    )), t.extent && (t.extent = Ai(
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
    for (const o in Wt)
      delete e[o];
    this.setProperties(e, !0);
    const n = QC(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const i = HC(t), r = n.constraint, s = YC(t);
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
      const r = (
        /** @type {number} */
        this.getResolution()
      ), s = r / 2 * (i[3] - e[3] + e[1] - i[1]), o = r / 2 * (i[0] - e[0] + e[2] - i[2]);
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
      let i = arguments[n];
      i.center && (i = Object.assign({}, i), i.center = Re(
        i.center,
        this.getProjection()
      )), i.anchor && (i = Object.assign({}, i), i.anchor = Re(
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
      n && ni(n, !0);
      return;
    }
    let r = Date.now(), s = (
      /** @type {import("./coordinate.js").Coordinate} */
      /** @type {import("./coordinate.js").Coordinate} */
      this.targetCenter_.slice()
    ), o = this.targetResolution_, g = (
      /** @type {number} */
      this.targetRotation_
    );
    const a = [];
    for (; i < e; ++i) {
      const C = (
        /** @type {AnimationOptions} */
        arguments[i]
      ), I = (
        /** @type {Animation} */
        {
          start: r,
          complete: !1,
          anchor: C.anchor,
          duration: C.duration !== void 0 ? C.duration : 1e3,
          easing: C.easing || ZC,
          callback: n
        }
      );
      if (C.center && (I.sourceCenter = s, I.targetCenter = C.center.slice(), s = I.targetCenter), C.zoom !== void 0 ? (I.sourceResolution = o, I.targetResolution = this.getResolutionForZoom(C.zoom), o = I.targetResolution) : C.resolution && (I.sourceResolution = o, I.targetResolution = C.resolution, o = I.targetResolution), C.rotation !== void 0) {
        I.sourceRotation = g;
        const c = Rr(C.rotation - g + Math.PI, 2 * Math.PI) - Math.PI;
        I.targetRotation = g + c, g = I.targetRotation;
      }
      KC(I) ? I.complete = !0 : r += I.duration, a.push(I);
    }
    this.animations_.push(a), this.setHint(Se.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[Se.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[Se.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(Se.ANIMATING, -this.hints_[Se.ANIMATING]);
    let t;
    for (let e = 0, n = this.animations_.length; e < n; ++e) {
      const i = (
        /** @type {Array<Animation>} */
        this.animations_[e]
      );
      if (
        /** @type {Animation} */
        i[0].callback && ni(
          /** @type {Animation} */
          i[0].callback,
          !1
        ), !t
      )
        for (let r = 0, s = i.length; r < s; ++r) {
          const o = i[r];
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
      const i = (
        /** @type {Array<Animation>} */
        this.animations_[n]
      );
      let r = !0;
      for (let s = 0, o = i.length; s < o; ++s) {
        const g = i[s];
        if (g.complete)
          continue;
        const a = t - g.start;
        let C = g.duration > 0 ? a / g.duration : 1;
        C >= 1 ? (g.complete = !0, C = 1) : r = !1;
        const I = g.easing(C);
        if (g.sourceCenter) {
          const c = g.sourceCenter[0], u = g.sourceCenter[1], d = (
            /** @type {import("./coordinate.js").Coordinate} */
            g.targetCenter[0]
          ), f = (
            /** @type {import("./coordinate.js").Coordinate} */
            g.targetCenter[1]
          );
          this.nextCenter_ = /** @type {import("./coordinate.js").Coordinate} */
          g.targetCenter;
          const m = c + I * (d - c), h = u + I * (f - u);
          this.targetCenter_ = [m, h];
        }
        if (g.sourceResolution && g.targetResolution) {
          const c = I === 1 ? g.targetResolution : g.sourceResolution + I * (g.targetResolution - g.sourceResolution);
          if (g.anchor) {
            const u = this.getViewportSize_(this.getRotation()), d = (
              /** @type {Constraints} */
              this.constraints_.resolution(c, 0, u, !0)
            );
            this.targetCenter_ = this.calculateCenterZoom(
              /** @type {number} */
              d,
              /** @type {import("./coordinate.js").Coordinate} */
              g.anchor
            );
          }
          this.nextResolution_ = g.targetResolution, this.targetResolution_ = c, this.applyTargetState_(!0);
        }
        if (g.sourceRotation !== void 0 && g.targetRotation !== void 0) {
          const c = I === 1 ? Rr(g.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : g.sourceRotation + I * (g.targetRotation - g.sourceRotation);
          if (g.anchor) {
            const u = (
              /** @type {Constraints} */
              this.constraints_.rotation(c, !0)
            );
            this.targetCenter_ = this.calculateCenterRotate(
              /** @type {number} */
              u,
              /** @type {import("./coordinate.js").Coordinate} */
              g.anchor
            );
          }
          this.nextRotation_ = g.targetRotation, this.targetRotation_ = c;
        }
        if (this.applyTargetState_(!0), e = !0, !g.complete)
          break;
      }
      if (r) {
        this.animations_[n] = null, this.setHint(Se.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const s = i[0].callback;
        s && ni(s, !0);
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
    return i !== void 0 && (n = [i[0] - e[0], i[1] - e[1]], Fr(n, t - this.getRotation()), BI(n, e)), n;
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
      const s = e[0] - t * (e[0] - i[0]) / r, o = e[1] - t * (e[1] - i[1]) / r;
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
    return t && zs(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Wt.CENTER)
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
    return IC(e, this.getProjection());
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
    xe(e, "The view center is not defined");
    const n = (
      /** @type {!number} */
      this.getResolution()
    );
    xe(n !== void 0, "The view resolution is not defined");
    const i = (
      /** @type {!number} */
      this.getRotation()
    );
    return xe(i !== void 0, "The view rotation is not defined"), vI(e, n, i, t);
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
      this.get(Wt.RESOLUTION)
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
      Ai(t, this.getProjection()),
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
    const n = Zr(t) / e[0], i = hn(t) / e[1];
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
    const e = (
      /** @type {number} */
      this.getConstrainedResolution(
        /** @type {number} */
        this.maxResolution_
      )
    ), n = (
      /** @type {number} */
      this.minResolution_
    ), i = Math.log(e / n) / Math.log(t);
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
      this.get(Wt.ROTATION)
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
    ), i = (
      /** @type {number} */
      this.minResolution_
    ), r = Math.log(n / i) / e;
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
      i = tr(
        i,
        this.getViewportSize_(),
        [s[0] / 2 + r[3], s[1] / 2 + r[0]],
        /** @type {number} */
        e,
        n
      );
    }
    return {
      center: i.slice(0),
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
    let e = this.minZoom_ || 0, n, i;
    if (this.resolutions_) {
      const r = _g(this.resolutions_, t, 1);
      e = r, n = this.resolutions_[r], r == this.resolutions_.length - 1 ? i = 2 : i = n / this.resolutions_[r + 1];
    } else
      n = /** @type {number} */
      this.maxResolution_, i = /** @type {number} */
      this.zoomFactor_;
    return e + Math.log(
      /** @type {number} */
      n / t
    ) / Math.log(
      /** @type {number} */
      i
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
      const e = _t(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), n = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(n, _t(t - e, 0, 1));
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
    if (xe(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      xe(
        !$g(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const i = Ai(t, this.getProjection());
      n = Vs(i);
    } else if (t.getType() === "Circle") {
      const i = Ai(
        t.getExtent(),
        this.getProjection()
      );
      n = Vs(i), n.rotate(this.getRotation(), Ii(i));
    } else {
      const i = aC();
      i ? n = /** @type {import("./geom/SimpleGeometry.js").default} */
      t.clone().transform(i, this.getProjection()) : n = t;
    }
    this.fitInternal(n, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent.js").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), n = Math.cos(e), i = Math.sin(-e), r = t.getFlatCoordinates(), s = t.getStride();
    let o = 1 / 0, g = 1 / 0, a = -1 / 0, C = -1 / 0;
    for (let I = 0, c = r.length; I < c; I += s) {
      const u = r[I] * n - r[I + 1] * i, d = r[I] * i + r[I + 1] * n;
      o = Math.min(o, u), g = Math.min(g, d), a = Math.max(a, u), C = Math.max(C, d);
    }
    return [o, g, a, C];
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
    const o = this.rotatedExtentForGeometry(t);
    let g = this.getResolutionForExtentInternal(o, [
      n[0] - i[1] - i[3],
      n[1] - i[0] - i[2]
    ]);
    g = isNaN(g) ? s : Math.max(g, s), g = /** @type {number} */
    this.getConstrainedResolution(g, r ? 0 : 1);
    const a = this.getRotation(), C = Math.sin(a), I = Math.cos(a), c = Ii(o);
    c[0] += (i[1] - i[3]) / 2 * g, c[1] += (i[0] - i[2]) / 2 * g;
    const u = c[0] * I - c[1] * C, d = c[1] * I + c[0] * C, f = this.getConstrainedCenter([u, d], g), m = e.callback ? e.callback : Mr;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: g,
        center: f,
        duration: e.duration,
        easing: e.easing
      },
      m
    ) : (this.targetResolution_ = g, this.targetCenter_ = f, this.applyTargetState_(!1, !0), ni(m, !0));
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
      Re(t, this.getProjection()),
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
      tr(
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
  calculateCenterShift(t, e, n, i) {
    let r;
    const s = this.padding_;
    if (s && t) {
      const o = this.getViewportSizeMinusPadding_(-n), g = tr(
        t,
        i,
        [o[0] / 2 + s[3], o[1] / 2 + s[0]],
        e,
        n
      );
      r = [
        t[0] - g[0],
        t[1] - g[1]
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
    const e = zs(
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
    e = e && Re(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), i = this.getViewportSize_(this.getRotation()), r = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_ * t,
        0,
        i,
        n
      )
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(
      /** @type {number} */
      r,
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
    e && (e = Re(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), i = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_ + t,
        n
      )
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(
      /** @type {number} */
      i,
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
      t && Re(t, this.getProjection())
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
    const n = this.getAnimating() || this.getInteracting() || e, i = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_,
        n
      )
    ), r = this.getViewportSize_(i), s = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_,
        0,
        r,
        n
      )
    ), o = (
      /** @type {Constraints} */
      this.constraints_.center(
        /** @type {import("./coordinate.js").Coordinate|undefined} */
        this.targetCenter_,
        /** @type {number} */
        s,
        r,
        n,
        /** @type {import("./coordinate.js").Coordinate} */
        this.calculateCenterShift(
          /** @type {import("./coordinate.js").Coordinate} */
          this.targetCenter_,
          /** @type {number} */
          s,
          /** @type {number} */
          i,
          r
        )
      )
    );
    this.get(Wt.ROTATION) !== i && this.set(Wt.ROTATION, i), this.get(Wt.RESOLUTION) !== s && (this.set(Wt.RESOLUTION, s), this.set("zoom", this.getZoom(), !0)), (!o || !this.get(Wt.CENTER) || !Ci(this.get(Wt.CENTER), o)) && this.set(Wt.CENTER, o), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
    const i = e || 0, r = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_
      )
    ), s = this.getViewportSize_(r), o = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_,
        i,
        s
      )
    ), g = (
      /** @type {Constraints} */
      this.constraints_.center(
        /** @type {import("./coordinate.js").Coordinate|undefined} */
        this.targetCenter_,
        /** @type {number} */
        o,
        s,
        !1,
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
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = o, this.targetRotation_ = r, this.targetCenter_ = g, this.applyTargetState_();
      return;
    }
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== o || this.getRotation() !== r || !this.getCenterInternal() || !Ci(
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal(),
      /** @type {import("./coordinate.js").Coordinate} */
      g
    )) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: r,
      center: g,
      resolution: o,
      duration: t,
      easing: Ri,
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
    this.resolveConstraints(0), this.setHint(Se.INTERACTING, 1);
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
    n = n && Re(n, this.getProjection()), this.endInteractionInternal(t, e, n);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, n) {
    this.getInteracting() && (this.setHint(Se.INTERACTING, -1), this.resolveConstraints(t, e, n));
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
function ni(A, t) {
  setTimeout(function() {
    A(t);
  }, 0);
}
function HC(A) {
  if (A.extent !== void 0) {
    const e = A.smoothExtentConstraint !== void 0 ? A.smoothExtentConstraint : !0;
    return Hs(
      A.extent,
      /** @type {boolean} */
      A.constrainOnlyCenter,
      e
    );
  }
  const t = (
    /** @type {import("./proj/Projection.js").default} */
    Vr(A.projection, "EPSG:3857")
  );
  if (A.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, Hs(e, !1, !1);
  }
  return jC;
}
function QC(A) {
  let t, e, n, s = A.minZoom !== void 0 ? A.minZoom : $i, o = A.maxZoom !== void 0 ? A.maxZoom : 28;
  const g = A.zoomFactor !== void 0 ? A.zoomFactor : 2, a = A.multiWorld !== void 0 ? A.multiWorld : !1, C = A.smoothResolutionConstraint !== void 0 ? A.smoothResolutionConstraint : !0, I = A.showFullExtent !== void 0 ? A.showFullExtent : !1, c = (
    /** @type {import("./proj/Projection.js").default} */
    Vr(A.projection, "EPSG:3857")
  ), u = c.getExtent();
  let d = A.constrainOnlyCenter, f = A.extent;
  if (!a && !f && c.isGlobal() && (d = !1, f = u), A.resolutions !== void 0) {
    const m = A.resolutions;
    e = m[s], n = m[o] !== void 0 ? m[o] : m[m.length - 1], A.constrainResolution ? t = UC(
      m,
      C,
      /** @type {import("./extent.js").Extent|undefined} */
      !d && f,
      I
    ) : t = Qs(
      e,
      n,
      C,
      /** @type {import("./extent.js").Extent|undefined} */
      !d && f,
      I
    );
  } else {
    const h = (u ? Math.max(Zr(u), hn(u)) : (
      // use an extent that can fit the whole world if need be
      360 * /** @type {number} */
      to.degrees / /** @type {number} */
      c.getMetersPerUnit()
    )) / VC / Math.pow(2, $i), w = h / Math.pow(2, 28 - $i);
    e = A.maxResolution, e !== void 0 ? s = 0 : e = h / Math.pow(g, s), n = A.minResolution, n === void 0 && (A.maxZoom !== void 0 ? A.maxResolution !== void 0 ? n = e / Math.pow(g, o) : n = h / Math.pow(g, o) : n = w), o = s + Math.floor(
      Math.log(e / n) / Math.log(g)
    ), n = e / Math.pow(g, o - s), A.constrainResolution ? t = FC(
      g,
      e,
      n,
      C,
      /** @type {import("./extent.js").Extent|undefined} */
      !d && f,
      I
    ) : t = Qs(
      e,
      n,
      C,
      /** @type {import("./extent.js").Extent|undefined} */
      !d && f,
      I
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
function YC(A) {
  if (A.enableRotation !== void 0 ? A.enableRotation : !0) {
    const e = A.constrainRotation;
    return e === void 0 || e === !0 ? _C() : e === !1 ? Ys : typeof e == "number" ? WC(e) : Ys;
  }
  return ts;
}
function KC(A) {
  return !(A.sourceCenter && A.targetCenter && !Ci(A.sourceCenter, A.targetCenter) || A.sourceResolution !== A.targetResolution || A.sourceRotation !== A.targetRotation);
}
function tr(A, t, e, n, i) {
  const r = Math.cos(-i);
  let s = Math.sin(-i), o = A[0] * r - A[1] * s, g = A[1] * r + A[0] * s;
  o += (t[0] / 2 - e[0]) * n, g += (e[1] - t[1] / 2) * n, s = -s;
  const a = o * r - g * s, C = g * r + o * s;
  return [a, C];
}
const JC = {
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
class qC extends PA {
  /**
   * @param {Options<NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[_.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, xe(
      typeof e[_.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[_.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[_.Z_INDEX] = t.zIndex, e[_.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[_.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[_.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[_.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
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
    return e.opacity = _t(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
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
    xe(typeof t == "number", "Layer opacity must be a number"), this.set(_.OPACITY, t);
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
    this.state_ && (this.state_.layer = /** @type {?} */
    null, this.state_ = null), super.disposeInternal();
  }
}
class uo extends qC {
  /**
   * @param {Options<SourceType, NoInfer<Properties>>} options Layer options.
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
    this.changed();
    const t = this.getSource();
    !t || this.sourceReady_ || t.getState() !== "ready" || (this.sourceReady_ = !0, this.dispatchEvent("sourceready"));
  }
  /**
   * @private
   */
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ && (Cn(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = pA(
      t,
      Be.CHANGE,
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
    !t && n && (t = n.getView()), t instanceof Ks ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t;
    const i = (
      /** @type {import("../View.js").ViewStateLayerStateExtent} */
      e
    );
    !i.layerStatesArray && n && (i.layerStatesArray = n.getLayerGroup().getLayerStatesArray());
    let r;
    if (i.layerStatesArray) {
      if (r = i.layerStatesArray.find(
        (o) => o.layer === this
      ), !r)
        return !1;
    } else
      r = this.getLayerState();
    const s = this.getExtent();
    return $C(r, i.viewState) && (!s || zr(s, i.extent));
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
    const n = t instanceof Ks ? t.getViewStateAndExtent() : t;
    let i = e(
      /** @type {import("../View.js").ViewStateLayerStateExtent} */
      n
    );
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
    this.mapPrecomposeKey_ && (Cn(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (Cn(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = pA(
      t,
      JC.PRECOMPOSE,
      /** @type {import("../events.js").ListenerFunction} */
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = pA(this, Be.CHANGE, t.render, t), this.changed());
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
    xe(
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
function $C(A, t) {
  if (!A.visible)
    return !1;
  const e = t.resolution;
  if (e < A.minResolution || e >= A.maxResolution)
    return !1;
  const n = t.zoom;
  return n > A.minZoom && n <= A.maxZoom;
}
function tc(A) {
  const t = A && typeof A.getPixelRatio == "function" ? A.getPixelRatio() : typeof window < "u" && window.devicePixelRatio || 1;
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : 1;
}
function ho(A, t, e) {
  const n = tc(A);
  return Math.abs(t.width / n - e[0]) < 1 && Math.abs(t.height / n - e[1]) < 1;
}
class ec extends uo {
  constructor(t) {
    let e;
    const n = function(i) {
      const r = this.getSource(), s = r.mapboxMap;
      if (!s)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      r.style !== e && (s.setStyle(r.style), e = r.style);
      const o = s.getCanvas(), g = i.viewState, a = this.getVisible();
      o.style.display = a ? "block" : "none";
      const C = this.getOpacity();
      o.style.opacity = C, o.style.position = "absolute", o.style.left = "0", o.style.top = "0";
      let I = !1;
      if (i.size) {
        const [w, S] = i.size;
        ho(s, o, [w, S]) || (s.resize(), I = !0);
      }
      const c = g.rotation * -180 / Math.PI, u = Nr(g.center), d = g.zoom - 1, f = s.getBearing(), m = s.getCenter().toArray(), h = s.getZoom();
      return !I && c == f && u[0] == m[0] && u[1] == m[1] && d == h || (c != f && s.rotateTo(c, {
        animate: !1
      }), (u[0] != m[0] || u[1] != m[1] || d != h) && s.jumpTo({
        center: u,
        zoom: d,
        animate: !1
      }), s._frame && (s._frame.cancel(), s._frame = null), s._render()), o;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
class Ac extends uo {
  constructor(t) {
    let e;
    const n = function(i) {
      const r = this.getSource(), s = r.maplibreMap;
      if (!s)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      r.style !== e && (s.setStyle(r.style), e = r.style);
      const o = s.getCanvas(), g = i.viewState, a = this.getVisible();
      o.style.display = a ? "block" : "none";
      const C = this.getOpacity();
      o.style.opacity = C;
      const c = -g.rotation * 180 / Math.PI, u = s.getBearing();
      Math.abs(c - u) > 0.01 && (s.stop(), s.setBearing(c));
      const d = Nr(g.center), f = g.zoom - 1;
      if ((s.getCenter().toArray().toString() !== d.toString() || s.getZoom() !== f) && s.jumpTo({
        center: d,
        zoom: f,
        animate: !1
      }), s._frame && (s._frame.cancel(), s._frame = null), i.size) {
        const [m, h] = i.size;
        ho(s, o, [m, h]) || s.resize();
      }
      return s._render(), Math.abs(s.getZoom() - f) > 0.01 && s.setZoom(f), o.style.position = "absolute", o.style.left = "0", o.style.top = "0", o;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
const fo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", mo = "data:image/png;base64,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", po = "data:image/png;base64,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", es = "data:image/png;base64,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", nc = new ee({
  image: new MA({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: fo
  })
}), ic = new ee({
  image: new MA({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: mo
  })
}), rc = new ee({
  image: new MA({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: po
  })
}), sc = new ee({
  fill: new mr({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new dr({
    color: [128, 128, 256, 1],
    width: 3
  })
}), gc = new ee({
  image: new MA({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: es
  })
});
class De extends _o {
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
    t = Ae(t || {});
    const e = new Yn({
      source: new Kn({
        wrapX: !1
      })
    });
    e.set("name", "gps");
    const n = new Yn({
      source: new Kn({
        wrapX: !1
      })
    });
    n.set("name", "marker");
    const i = new Yn({
      source: new Kn({
        wrapX: !1
      })
    });
    i.set("name", "feature");
    const r = new Yn({
      source: new Kn({
        wrapX: !1
      })
    });
    r.set("name", "envelope");
    const s = De.spawnLayer(
      null,
      t.source,
      t.target
    ), o = new Ho();
    o.set("name", "overlay");
    const a = {
      controls: t.controls ? t.controls : [],
      layers: [
        s,
        o,
        r,
        i,
        e,
        n
      ],
      target: t.div,
      view: new Mg({
        center: t.defaultCenter || [0, 0],
        zoom: t.defaultZoom || 2,
        rotation: t.defaultRotation || 0,
        multiWorld: !0
      })
    };
    t.interactions && (a.interactions = t.interactions), super(a), this.fakeGps = t.fakeGps, this.fakeRadius = t.fakeRadius, this.homePosition = t.homePosition, this.northUp = t.northUp, this.tapDuration = t.tapDuration, this.homeMarginPixels = t.homeMarginPixels, this.tapUIVanish = t.tapUIVanish, this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const C = this.getView();
    this.__ignore_first_move = !0;
    const I = () => {
      this.__ignore_first_move || this.dispatchEvent("movestart"), this.__ignore_first_move = !1, C.un("propertychange", I);
    };
    C.on("propertychange", I), this.on("moveend", () => {
      C.on("propertychange", I);
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
    const n = e && typeof e.isWmts == "function" && e.isWmts() ? e.minZoom : void 0;
    typeof n == "number" && Number.isFinite(n) && n > 4 ? t.setMinZoom(n - 4) : t.setMinZoom(-1 / 0);
  }
  static spawnLayer(t, e, n) {
    return e instanceof hi || e instanceof fi || !(t instanceof Wi) ? (e instanceof hi ? t = new ec({
      style: e.style,
      accessToken: e.accessToken,
      container: n,
      source: e
    }) : e instanceof fi ? t = new Ac({
      style: e.style,
      container: n,
      source: e
    }) : (t = new Wi({
      source: e
    }), De.applyWmtsZoomGate(t, e)), t.set("name", "base")) : (t.setSource(e), De.applyWmtsZoomGate(t, e)), t;
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
    const i = this.getSource(n), r = new Vo(t);
    return e && r.setStyle(e), i.addFeature(r), r;
  }
  removeFeature(t, e) {
    this.getSource(e).removeFeature(t);
  }
  resetFeature(t) {
    this.getSource(t).clear();
  }
  setGPSPosition(t, e = void 0) {
    const n = e == "sub" ? rc : e == "hide" ? ic : nc;
    e != "sub" && this.resetFeature("gps"), t && (this.setFeature(
      {
        geometry: new yn(t.xy)
      },
      n,
      "gps"
    ), e || this.setFeature(
      {
        geometry: new Qr(t.xy, t.rad)
      },
      sc,
      "gps"
    ));
  }
  setMarker(t, e, n, i) {
    return i || (i = "marker"), e.geometry = new yn(t), n ? typeof n == "string" ? n = new ee({
      image: new MA({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: n
      })
    }) : n instanceof ee || (n = new ee({
      image: new MA(n)
    })) : n = gc, this.setFeature(e, n, i);
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
    n.stroke != null && (r.stroke = new dr(n.stroke)), n.fill != null && (r.fill = new mr(n.fill));
    const s = new ee(r), o = e === "Line" ? new ui(t) : new Ve(t);
    return this.setFeature(
      {
        geometry: o,
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
      e != null && (s.stroke = new dr(e)), n != null && (s.fill = new mr(n)), r = new ee(s);
    }
    return this.setFeature(
      {
        geometry: new Ve([t])
      },
      r,
      i
    );
  }
  exchangeSource(t = void 0) {
    const e = this.getLayers(), n = e.item(0), i = De.spawnLayer(n, t, this.getTarget());
    i != n && e.setAt(0, i), t && t.setMap(this);
  }
  setLayer(t = void 0) {
    const e = this.getLayer("overlay").getLayers();
    if (e.clear(), t) {
      const n = new Wi({
        source: t
      });
      De.applyWmtsZoomGate(n, t), e.push(n);
    }
  }
  setTransparency(t) {
    const e = (100 - t) / 100, n = this.getSource();
    n instanceof TA || n instanceof Dr ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(e)) : this.getLayers().item(0).setOpacity(e);
  }
  setGPSMarker(t, e) {
    this.getLayers().item(0).getSource().setGPSMarker(t, e);
  }
}
const on = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: Be.DBLCLICK,
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
}, Js = {
  ACTIVE: "active"
};
class Rn extends PA {
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
      this.get(Js.ACTIVE)
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
    this.set(Js.ACTIVE, t);
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
function oc(A, t, e) {
  const n = A.getCenterInternal();
  if (n) {
    const i = [n[0] + t[0], n[1] + t[1]];
    A.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: zC,
      center: A.getConstrainedCenter(i)
    });
  }
}
function As(A, t, e, n) {
  const i = A.getZoom();
  if (i === void 0)
    return;
  const r = A.getConstrainedZoom(i + t);
  if (r === void 0)
    return;
  const s = A.getResolutionForZoom(r);
  s !== void 0 && (A.getAnimating() && A.cancelAnimations(), A.animate({
    resolution: s,
    anchor: e,
    duration: n !== void 0 ? n : 250,
    easing: Ri
  }));
}
const ii = {
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
}, qs = {
  LENGTH: "length"
};
class ri extends de {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, n) {
    super(t), this.element = e, this.index = n;
  }
}
class ac extends PA {
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
    return this.get(qs.LENGTH);
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
      new ri(ii.ADD, e, t)
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
      new ri(ii.REMOVE, e, t)
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
      new ri(ii.REMOVE, i, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new ri(ii.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(qs.LENGTH, this.array_.length);
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
class Ic {
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
class Cc extends Rn {
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
    if (t.type == on.DBLCLICK) {
      const n = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), i = t.map, r = t.coordinate, s = n.shiftKey ? -this.delta_ : this.delta_, o = i.getView();
      As(o, s, r, this.duration_), n.preventDefault(), e = !0;
    }
    return !e;
  }
}
const He = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", cc = He.includes("safari") && !He.includes("chrom");
cc && (He.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(He));
const lc = He.includes("webkit") && !He.includes("edge"), yo = He.includes("macintosh");
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
function Br(A) {
  const t = arguments;
  return function(e) {
    let n = !0;
    for (let i = 0, r = t.length; i < r && (n = n && t[i](e), !!n); ++i)
      ;
    return n;
  };
}
const uc = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, hc = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, fc = function(A) {
  const t = A.map.getTargetElement();
  if (!t)
    return !1;
  const e = t.getRootNode(), n = A.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(n) : t.contains(n);
}, wo = function(A) {
  const t = A.map.getTargetElement();
  if (!t)
    return !0;
  const e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? fc(A) : !0;
}, dc = lI, vo = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.button == 0 && !(lc && yo && t.ctrlKey);
}, bo = function(A) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    A.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, mc = function(A) {
  const t = A.originalEvent;
  return yo ? t.metaKey : t.ctrlKey;
}, Eo = function(A) {
  const t = A.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, Mo = function(A) {
  const t = A.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, bA = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, pc = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class xA extends Rn {
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
      if (t.type == on.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == on.POINTERUP) {
        const n = this.handleUpEvent(t);
        this.handlingDownUpSequence = n && this.targetPointers.length > 0;
      }
    } else if (t.type == on.POINTERDOWN) {
      const n = this.handleDownEvent(t);
      this.handlingDownUpSequence = n, e = this.stopDown(n);
    } else t.type == on.POINTERMOVE && this.handleMoveEvent(t);
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
function ns(A) {
  const t = A.length;
  let e = 0, n = 0;
  for (let i = 0; i < t; i++)
    e += A[i].clientX, n += A[i].clientY;
  return { clientX: e / t, clientY: n / t };
}
class yc extends xA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: yi
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : Br(bo, pc);
    this.condition_ = t.onFocusOnly ? Br(wo, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const n = this.targetPointers, i = e.getEventPixel(ns(n));
    if (n.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(i[0], i[1]), this.lastCentroid) {
        const r = [
          this.lastCentroid[0] - i[0],
          i[1] - this.lastCentroid[1]
        ], o = t.map.getView(), g = o.getResolution();
        g !== void 0 && (OI(r, g), Fr(r, o.getRotation()), o.adjustCenterInternal(r));
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
        const i = this.kinetic_.getDistance(), r = this.kinetic_.getAngle(), s = n.getCenterInternal();
        if (s) {
          const o = (
            /** @type {import("../pixel.js").Pixel} */
            e.getPixelFromCoordinateInternal(s)
          ), g = e.getCoordinateFromPixelInternal([
            o[0] - i * Math.cos(r),
            o[1] - i * Math.sin(r)
          ]);
          n.animateInternal({
            center: n.getConstrainedCenter(
              /** @type {import("../coordinate.js").Coordinate} */
              g
            ),
            duration: 500,
            easing: Ri
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
class wc extends xA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: yi
    }), this.condition_ = t.condition ? t.condition : hc, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!bA(t))
      return;
    const e = t.map, n = e.getView();
    if (n.getConstraints().rotation === ts)
      return;
    const i = e.getSize();
    if (!i)
      return;
    const r = t.pixel, s = Math.atan2(i[1] / 2 - r[1], r[0] - i[0] / 2);
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
    return bA(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return bA(t) && vo(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class vc extends Fg {
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
    const n = "px", i = this.element_.style;
    i.left = Math.min(t[0], e[0]) + n, i.top = Math.min(t[1], e[1]) + n, i.width = Math.abs(e[0] - t[0]) + n, i.height = Math.abs(e[1] - t[1]) + n;
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
    ], i = this.map_, r = n.map(
      (g) => i.getCoordinateFromPixelInternal(g)
    ), s = r[0];
    if (!s)
      return;
    r[4] = s.slice();
    const o = (
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      r
    );
    this.geometry_ ? this.geometry_.setCoordinates([o]) : this.geometry_ = new Ve([o]);
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
const uA = {
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
class tn extends de {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default|null} mapBrowserEvent Originating event.
   */
  constructor(t, e, n) {
    super(t), this.coordinate = e, this.mapBrowserEvent = n;
  }
}
class bc extends xA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new vc(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? vo, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
      new tn(
        uA.BOXDRAG,
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
      new tn(
        e ? uA.BOXEND : uA.BOXCANCEL,
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
      new tn(
        uA.BOXSTART,
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
      new tn(uA.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new tn(uA.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class Ec extends bc {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : Eo;
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
    let i = this.getGeometry();
    if (this.out_) {
      const r = n.rotatedExtentForGeometry(i), s = n.getResolutionForExtentInternal(r), o = n.getResolution();
      if (s === void 0 || o === void 0)
        return;
      const g = o / s;
      i = i.clone(), i.scale(g * g);
    }
    n.fitInternal(i, {
      duration: this.duration_,
      easing: Ri
    });
  }
}
const Xe = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class Mc extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return bo(e) && Mo(e);
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
    if (t.type == Be.KEYDOWN) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), i = n.key;
      if (this.condition_(t) && (i == Xe.DOWN || i == Xe.LEFT || i == Xe.RIGHT || i == Xe.UP)) {
        const s = t.map.getView(), o = s.getResolution();
        if (o === void 0)
          return !0;
        const g = o * this.pixelDelta_;
        let a = 0, C = 0;
        i == Xe.DOWN ? C = -g : i == Xe.LEFT ? a = -g : i == Xe.RIGHT ? a = g : C = g;
        const I = [a, C];
        Fr(I, s.getRotation()), oc(s, I, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class Rc extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !mc(e) && Mo(e);
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
    if (t.type == Be.KEYDOWN || t.type == Be.KEYPRESS) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), i = n.key;
      if (this.condition_(t) && (i === "+" || i === "-")) {
        const r = t.map, s = i === "+" ? this.delta_ : -this.delta_, o = r.getView();
        As(o, s, void 0, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const Sc = 40, Tc = 300, Pc = 3;
class xc extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : dc;
    this.condition_ = t.onFocusOnly ? Br(wo, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
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
    if (!this.condition_(t) || t.type !== Be.WHEEL)
      return !0;
    const n = t.map, i = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    i.preventDefault();
    const r = i.ctrlKey && !t.ctrlKey;
    this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let s = i.deltaY;
    switch (i.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        s *= Sc;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        s *= Tc;
        break;
    }
    if (s === 0)
      return !1;
    this.lastDelta_ = s;
    const o = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = o), (!this.mode_ || o - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(s) < 4 ? "trackpad" : "wheel");
    const g = n.getView();
    if (this.mode_ === "trackpad")
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (g.getAnimating() && g.cancelAnimations(), g.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), r && (s = s * Pc), g.adjustZoom(
        -s / this.deltaPerZoom_,
        this.lastAnchor_ ? n.getCoordinateFromPixel(this.lastAnchor_) : void 0
      ), this.startTime_ = o, !1;
    this.totalDelta_ += s;
    const a = Math.max(this.timeout_ - (o - this.startTime_), 0);
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
    let n = -_t(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (n = n ? n > 0 ? 1 : -1 : 0), As(
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
class Dc extends xA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = yi), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
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
      const g = r - this.lastAngle_;
      this.rotationDelta_ += g, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = g;
    }
    this.lastAngle_ = r;
    const s = t.map, o = s.getView();
    o.getConstraints().rotation !== ts && (this.anchor_ = s.getCoordinateFromPixelInternal(
      s.getEventPixel(ns(this.targetPointers))
    ) ?? null, this.rotating_ && (s.render(), o.adjustRotationInternal(e, this.anchor_ ?? void 0)));
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
class Bc extends xA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = yi), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const n = this.targetPointers[0], i = this.targetPointers[1], r = n.clientX - i.clientX, s = n.clientY - i.clientY, o = Math.sqrt(r * r + s * s);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / o), this.lastDistance_ = o;
    const g = t.map, a = g.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = g.getCoordinateFromPixelInternal(
      g.getEventPixel(ns(this.targetPointers))
    ) ?? null, g.render(), a.adjustResolutionInternal(e, this.anchor_ ?? void 0);
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
function $s(A) {
  A = A || {};
  const t = new ac(), e = new Ic(-5e-3, 0.05, 100);
  return (A.altShiftDragRotate === void 0 || A.altShiftDragRotate) && t.push(new wc()), (A.doubleClickZoom === void 0 || A.doubleClickZoom) && t.push(
    new Cc({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  ), (A.dragPan === void 0 || A.dragPan) && t.push(
    new yc({
      onFocusOnly: A.onFocusOnly,
      kinetic: e
    })
  ), (A.pinchRotate === void 0 || A.pinchRotate) && t.push(new Dc()), (A.pinchZoom === void 0 || A.pinchZoom) && t.push(
    new Bc({
      duration: A.zoomDuration
    })
  ), (A.keyboard === void 0 || A.keyboard) && (t.push(new Mc()), t.push(
    new Rc({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  )), (A.mouseWheelZoom === void 0 || A.mouseWheelZoom) && t.push(
    new xc({
      onFocusOnly: A.onFocusOnly,
      duration: A.zoomDuration
    })
  ), (A.shiftDragZoom === void 0 || A.shiftDragZoom) && t.push(
    new Ec({
      duration: A.zoomDuration
    })
  ), t;
}
class Oc extends xA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : Eo, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!bA(t))
      return;
    const e = t.map, n = e.getSize();
    if (!n)
      return;
    const i = t.pixel, r = i[0] - n[0] / 2, s = n[1] / 2 - i[1], o = Math.atan2(s, r), g = Math.sqrt(r * r + s * s), a = e.getView();
    if (this.lastAngle_ !== void 0) {
      const C = this.lastAngle_ - o;
      a.adjustRotationInternal(C);
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
    if (!bA(t))
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
    return bA(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
function Lc(A) {
  return kc(A[0], A[1], A[2]);
}
function kc(A, t, e) {
  return (t << A) + e;
}
const Nc = /\{z\}/g, Gc = /\{x\}/g, jc = /\{y\}/g, Xc = /\{-y\}/g;
function Zc(A, t, e, n, i) {
  return A.replace(Nc, t.toString()).replace(Gc, e.toString()).replace(jc, n.toString()).replace(Xc, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function zc(A, t) {
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
      return Zc(A, r, e[1], e[2]);
    })
  );
}
function tg(A, t) {
  const e = A.length, n = new Array(e);
  for (let i = 0; i < e; ++i)
    n[i] = zc(A[i]);
  return Uc(n);
}
function Uc(A) {
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
      const i = Lc(t), r = Rr(i, A.length);
      return A[r](t, e, n);
    })
  );
}
for (let A = 0; A < 9; A++) {
  const t = `ZOOM:${A}`, e = 256 * Math.pow(2, A);
  (function(n, i) {
    const r = new Wo({
      code: n,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, i, i],
      units: "m"
    });
    fr(r), oi(
      "EPSG:3857",
      r,
      (s) => {
        const o = (s[0] + V) * i / (2 * V), g = (-s[1] + V) * i / (2 * V);
        return [o, g];
      },
      (s) => {
        const o = s[0] * (2 * V) / i - V, g = -1 * (s[1] * (2 * V) / i - V);
        return [o, g];
      }
    );
  })(t, e);
}
class Ro extends sI(Rg) {
  constructor(t = {}) {
    t = Ug(t), t.wrapX = !1;
    const e = Math.log2(t.width / ze), n = Math.log2(t.height / ze);
    t.maxZoom = Math.ceil(Math.max(e, n)), t.tileUrlFunction = t.tileUrlFunction || function(i) {
      const r = i[0], s = i[1], o = i[2];
      return (
        // @ts-ignore
        s * ze * Math.pow(2, this.maxZoom - r) >= this.width || // @ts-ignore
        o * ze * Math.pow(2, this.maxZoom - r) >= this.height || s < 0 || o < 0 ? Bg : this._tileUrlFunction(i)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = tg(t.urls) : t.url && (this._tileUrlFunction = tg(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * ze, this.initialize(t);
  }
}
class di extends TA {
  static isBasemap_ = !1;
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
const Ie = "https://weiwudi.example.com/api/";
let er, hA;
class Fc {
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
class te extends Fc {
  static async registerSW(t, e) {
    if (!("serviceWorker" in navigator))
      throw "Error: Service worker is not supported";
    let n;
    try {
      n = await navigator.serviceWorker.register(t, e);
    } catch (i) {
      throw `Error: Service worker registration failed with ${i}`;
    }
    return await te.waitForController(), await te.swCheck(), n;
  }
  static async waitForController() {
    return new Promise((t, e) => {
      let n = !1, i;
      function r() {
        n || (n = !0, i !== void 0 && clearTimeout(i), navigator.serviceWorker.removeEventListener("controllerchange", s));
      }
      function s() {
        navigator.serviceWorker.controller && (r(), t());
      }
      navigator.serviceWorker.addEventListener("controllerchange", s), i = setTimeout(() => {
        r(), e("Error: Service worker did not control this page within 10000 ms");
      }, 1e4), navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.controller && (r(), t());
      }).catch(() => {
      });
    });
  }
  static async swCheck() {
    return hA !== void 0 ? hA : (er === void 0 && (er = new Promise((t, e) => {
      fetch(`${Ie}ping`).then((n) => {
        hA = !!n, t(hA);
      }).catch((n) => {
        hA = !1, t(hA);
      });
    })), er);
  }
  static async registerMap(t, e) {
    if (!await te.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    const i = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat", "cacheTtl", "cacheMaxBytes"].reduce((s, o) => (typeof e[o] < "u" && (e[o] instanceof Array ? e[o].map((g) => {
      s.append(o, g);
    }) : s.append(o, String(e[o]))), s), new URLSearchParams());
    i.append("mapID", t);
    const r = new URL(`${Ie}add`);
    if (r.search = i.toString(), n = await (await fetch(r.href)).text(), n.match(/^Error: /))
      throw n;
    return new te(t, JSON.parse(n));
  }
  static async retrieveMap(t) {
    if (!await te.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${Ie}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new te(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await te.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${Ie}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, e && Object.assign(this, e), this.url = `${Ie}cache/${t}/{z}/{x}/{y}`, this.listener = (n) => {
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
    if (this.checkAspect(), t = await (await fetch(`${Ie}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Ie}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Ie}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await te.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Ie}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function si(A, t, e) {
  const n = typeof A == "string" ? A : A.getCode(), i = typeof t == "string" ? t : t.getCode();
  let r = Ui(A, t);
  if (r == Fi && n != i) {
    const s = Ui(A, "EPSG:3857"), o = Ui("EPSG:3857", t);
    if (s == Fi && n != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (o == Fi && i != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    r = function(a) {
      return Ot(Ot(a, A, "EPSG:3857"), "EPSG:3857", t);
    }, oi(A, t, r, function(a) {
      return Ot(Ot(a, t, "EPSG:3857"), "EPSG:3857", A);
    });
  }
  if (e)
    return r(e);
}
const Wc = [
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
async function _c(A) {
  const t = A;
  if (Wc.forEach((r) => {
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
  const n = new Dg();
  n.setMapData(e);
  const i = n.getLayerTransform(0);
  if (t.strictMode = i.strictMode, t.vertexMode = i.vertexMode, t.yaxisMode = i.yaxisMode, t.width = i.wh?.[0], t.height = i.wh?.[1], t.gcps = i.points, t.edges = i.edges, A.sub_maps) {
    const r = A.sub_maps.map((s, o) => {
      const g = {
        importance: s.importance,
        priority: s.priority
      };
      if (s.compiled) {
        const a = n.getLayerTransform(o + 1);
        g.bounds = a?.bounds ?? s.bounds, g.gcps = a?.points, g.edges = a?.edges;
      } else
        g.bounds = s.bounds, g.gcps = s.gcps, g.edges = s.edges;
      return g;
    });
    t.sub_maps = r;
  }
  return [t, n];
}
function eg(A, t, e) {
  return typeof A.merc2XyVisibleLayers != "function" ? null : A.merc2XyVisibleLayers(t).filter(([, n]) => e(n)).slice(0, 2).map(([n, i]) => [n, i]);
}
class mi extends Ro {
  mapTransform;
  constructor(t = {}) {
    super(t), this.mapTransform = new Dg();
  }
  static async createAsync(t) {
    const [e, n] = await _c(t);
    t = e;
    const i = new mi(t);
    i.mapTransform = n;
    const r = n.getLayerTransform(0), s = new fn({
      code: `Illst:${i.mapID}`,
      extent: [0, 0, i.width, i.height],
      units: "m"
    });
    return fr(s), oi(
      s,
      "EPSG:3857",
      (o) => r.transform(o, !1),
      (o) => r.transform(o, !0)
    ), si("EPSG:4326", s), t.sub_maps && t.sub_maps.forEach((o, g) => {
      const a = g + 1, C = `Illst:${i.mapID}#${a}`, I = n.getLayerTransform(a);
      if (!I) return;
      const c = new fn({
        code: C,
        extent: [I.xy[0], I.xy[1], I.wh[0], I.wh[1]],
        units: "m"
      });
      fr(c), oi(
        c,
        "EPSG:3857",
        (u) => I.transform(u, !1, !0),
        (u) => I.transform(u, !0, !0)
      ), si("EPSG:4326", c);
    }), i;
  }
  xy2MercAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((i, r) => {
      i(si(n, "EPSG:3857", t));
    });
  }
  merc2XyAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((i, r) => {
      i(si("EPSG:3857", n, t));
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
    const [i, r] = n, s = this.mapTransform.getLayerTransform(i), o = this.mapTransform.getLayerTransform(0);
    if (!s) return;
    const g = [
      [e[0] - 150, e[1]],
      [e[0] + 150, e[1]],
      [e[0], e[1] - 150],
      [e[0], e[1] + 150]
    ], a = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ], C = g.map((f) => s.transform(f, !1)), I = a.map(
      (f) => o.transform(f, !1)
    ), c = Math.sqrt(
      Math.pow(C[0][0] - C[1][0], 2) + Math.pow(C[0][1] - C[1][1], 2)
    ), u = Math.sqrt(
      Math.pow(C[2][0] - C[3][0], 2) + Math.pow(C[2][1] - C[3][1], 2)
    ), d = (c + u) / 2;
    this.mercZoom || (this.mercZoom = Math.log(300 * (2 * V) / 256 / d) / Math.log(2) - 3), this.homePosition || (this.homePosition = Nr(r)), this.envelope = Ng([
      [
        I[0],
        I[1],
        I[2],
        I[3],
        I[0]
      ]
    ]), t(this);
  }
  // GPS マーカー用（呼び出し元は mixin の setGPSMarkerAsync のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1・2 位を返す（MaplatCore#104）:
  // 1 位は中心＋周囲 4 点を同じ層で逆変換した 5 点、2 位は中心だけ。undefined（旧 hide 表現）を含まない 0〜2 件。
  // 持たない（@maplat/transform 1.0.x）なら従来経路（mercs2SysCoords）。
  mercs2SysCoordsAsync_multiLayer(t) {
    const e = t[0], n = eg(
      this.mapTransform,
      e[0],
      (r) => this.insideCheckXy(r)
    );
    if (n)
      return Promise.resolve(
        n.map(([r, s], o) => {
          if (o > 0)
            return [[this.xy2SysCoord(s)], t[1]];
          const g = this.mapTransform.getLayerTransform(r);
          return [
            e.map(
              (C, I) => I === 0 ? s : g.transform(C, !0, r > 0)
            ).map((C) => this.xy2SysCoord(C)),
            t[1]
          ];
        })
      );
    const i = this.mapTransform.mercs2SysCoords(t[0]);
    return Promise.resolve(
      i.map((r) => {
        if (r)
          return [r.map((s) => s), t[1]];
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
    const e = eg(
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
var It = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, Rt = {
  searchParams: "URLSearchParams" in It,
  iterable: "Symbol" in It && "iterator" in Symbol,
  blob: "FileReader" in It && "Blob" in It && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in It,
  arrayBuffer: "ArrayBuffer" in It
};
function Vc(A) {
  return A && DataView.prototype.isPrototypeOf(A);
}
if (Rt.arrayBuffer)
  var Hc = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], Qc = ArrayBuffer.isView || function(A) {
    return A && Hc.indexOf(Object.prototype.toString.call(A)) > -1;
  };
function DA(A) {
  if (typeof A != "string" && (A = String(A)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(A) || A === "")
    throw new TypeError('Invalid character in header field name: "' + A + '"');
  return A.toLowerCase();
}
function is(A) {
  return typeof A != "string" && (A = String(A)), A;
}
function rs(A) {
  var t = {
    next: function() {
      var e = A.shift();
      return { done: e === void 0, value: e };
    }
  };
  return Rt.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function rt(A) {
  this.map = {}, A instanceof rt ? A.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(A) ? A.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : A && Object.getOwnPropertyNames(A).forEach(function(t) {
    this.append(t, A[t]);
  }, this);
}
rt.prototype.append = function(A, t) {
  A = DA(A), t = is(t);
  var e = this.map[A];
  this.map[A] = e ? e + ", " + t : t;
};
rt.prototype.delete = function(A) {
  delete this.map[DA(A)];
};
rt.prototype.get = function(A) {
  return A = DA(A), this.has(A) ? this.map[A] : null;
};
rt.prototype.has = function(A) {
  return this.map.hasOwnProperty(DA(A));
};
rt.prototype.set = function(A, t) {
  this.map[DA(A)] = is(t);
};
rt.prototype.forEach = function(A, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && A.call(t, this.map[e], e, this);
};
rt.prototype.keys = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push(e);
  }), rs(A);
};
rt.prototype.values = function() {
  var A = [];
  return this.forEach(function(t) {
    A.push(t);
  }), rs(A);
};
rt.prototype.entries = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push([e, t]);
  }), rs(A);
};
Rt.iterable && (rt.prototype[Symbol.iterator] = rt.prototype.entries);
function Ar(A) {
  if (!A._noBody) {
    if (A.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    A.bodyUsed = !0;
  }
}
function So(A) {
  return new Promise(function(t, e) {
    A.onload = function() {
      t(A.result);
    }, A.onerror = function() {
      e(A.error);
    };
  });
}
function Yc(A) {
  var t = new FileReader(), e = So(t);
  return t.readAsArrayBuffer(A), e;
}
function Kc(A) {
  var t = new FileReader(), e = So(t), n = /charset=([A-Za-z0-9_-]+)/.exec(A.type), i = n ? n[1] : "utf-8";
  return t.readAsText(A, i), e;
}
function Jc(A) {
  for (var t = new Uint8Array(A), e = new Array(t.length), n = 0; n < t.length; n++)
    e[n] = String.fromCharCode(t[n]);
  return e.join("");
}
function Ag(A) {
  if (A.slice)
    return A.slice(0);
  var t = new Uint8Array(A.byteLength);
  return t.set(new Uint8Array(A)), t.buffer;
}
function To() {
  return this.bodyUsed = !1, this._initBody = function(A) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : Rt.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : Rt.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : Rt.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : Rt.arrayBuffer && Rt.blob && Vc(A) ? (this._bodyArrayBuffer = Ag(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Rt.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || Qc(A)) ? this._bodyArrayBuffer = Ag(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Rt.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Rt.blob && (this.blob = function() {
    var A = Ar(this);
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
      var A = Ar(this);
      return A || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (Rt.blob)
        return this.blob().then(Yc);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var A = Ar(this);
    if (A)
      return A;
    if (this._bodyBlob)
      return Kc(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(Jc(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Rt.formData && (this.formData = function() {
    return this.text().then(tl);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var qc = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function $c(A) {
  var t = A.toUpperCase();
  return qc.indexOf(t) > -1 ? t : A;
}
function Qe(A, t) {
  if (!(this instanceof Qe))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (A instanceof Qe) {
    if (A.bodyUsed)
      throw new TypeError("Already read");
    this.url = A.url, this.credentials = A.credentials, t.headers || (this.headers = new rt(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !e && A._bodyInit != null && (e = A._bodyInit, A.bodyUsed = !0);
  } else
    this.url = String(A);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new rt(t.headers)), this.method = $c(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in It) {
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
Qe.prototype.clone = function() {
  return new Qe(this, { body: this._bodyInit });
};
function tl(A) {
  var t = new FormData();
  return A.trim().split("&").forEach(function(e) {
    if (e) {
      var n = e.split("="), i = n.shift().replace(/\+/g, " "), r = n.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(i), decodeURIComponent(r));
    }
  }), t;
}
function el(A) {
  var t = new rt(), e = A.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var i = n.split(":"), r = i.shift().trim();
    if (r) {
      var s = i.join(":").trim();
      try {
        t.append(r, s);
      } catch (o) {
        console.warn("Response " + o.message);
      }
    }
  }), t;
}
To.call(Qe.prototype);
function ne(A, t) {
  if (!(this instanceof ne))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new rt(t.headers), this.url = t.url || "", this._initBody(A);
}
To.call(ne.prototype);
ne.prototype.clone = function() {
  return new ne(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new rt(this.headers),
    url: this.url
  });
};
ne.error = function() {
  var A = new ne(null, { status: 200, statusText: "" });
  return A.ok = !1, A.status = 0, A.type = "error", A;
};
var Al = [301, 302, 303, 307, 308];
ne.redirect = function(A, t) {
  if (Al.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new ne(null, { status: t, headers: { location: A } });
};
var Ue = It.DOMException;
try {
  new Ue();
} catch {
  Ue = function(t, e) {
    this.message = t, this.name = e;
    var n = Error(t);
    this.stack = n.stack;
  }, Ue.prototype = Object.create(Error.prototype), Ue.prototype.constructor = Ue;
}
function Po(A, t) {
  return new Promise(function(e, n) {
    var i = new Qe(A, t);
    if (i.signal && i.signal.aborted)
      return n(new Ue("Aborted", "AbortError"));
    var r = new XMLHttpRequest();
    function s() {
      r.abort();
    }
    r.onload = function() {
      var a = {
        statusText: r.statusText,
        headers: el(r.getAllResponseHeaders() || "")
      };
      i.url.indexOf("file://") === 0 && (r.status < 200 || r.status > 599) ? a.status = 200 : a.status = r.status, a.url = "responseURL" in r ? r.responseURL : a.headers.get("X-Request-URL");
      var C = "response" in r ? r.response : r.responseText;
      setTimeout(function() {
        e(new ne(C, a));
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
        n(new Ue("Aborted", "AbortError"));
      }, 0);
    };
    function o(a) {
      try {
        return a === "" && It.location.href ? It.location.href : a;
      } catch {
        return a;
      }
    }
    if (r.open(i.method, o(i.url), !0), i.credentials === "include" ? r.withCredentials = !0 : i.credentials === "omit" && (r.withCredentials = !1), "responseType" in r && (Rt.blob ? r.responseType = "blob" : Rt.arrayBuffer && (r.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof rt || It.Headers && t.headers instanceof It.Headers)) {
      var g = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(a) {
        g.push(DA(a)), r.setRequestHeader(a, is(t.headers[a]));
      }), i.headers.forEach(function(a, C) {
        g.indexOf(C) === -1 && r.setRequestHeader(C, a);
      });
    } else
      i.headers.forEach(function(a, C) {
        r.setRequestHeader(C, a);
      });
    i.signal && (i.signal.addEventListener("abort", s), r.onreadystatechange = function() {
      r.readyState === 4 && i.signal.removeEventListener("abort", s);
    }), r.send(typeof i._bodyInit > "u" ? null : i._bodyInit);
  });
}
Po.polyfill = !0;
It.fetch || (It.fetch = Po, It.Headers = rt, It.Request = Qe, It.Response = ne);
const xo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", Do = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", Bo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", nl = {
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
    thumbnail: xo,
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
    thumbnail: Do
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
    thumbnail: Bo
  }
}, ng = (A) => (A || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function il(A, t) {
  typeof A == "string" && (A = { ...nl[A] }), A = Ae(Object.assign(A, t));
  const e = A.label || A.year;
  if (e !== void 0 && (A.label = e), ng(A.maptype)) {
    const o = A.maptype === "base" ? TA : A.maptype === "overlay" ? di : A.maptype === "mapbox" ? hi : A.maptype === "maplibre" ? fi : Dr;
    o.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.imageExtension || (A.imageExtension = "jpg"), Er(A.maptype) ? (delete A.url, delete A.urls) : A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await nr(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
    const g = await o.createAsync(A);
    return await g.initialWait, g;
  } else if (A.noload)
    return A.mercMaxZoom = A.mercMinZoom = void 0, new mi(A);
  const n = A.settingFile || `maps/${A.mapID}.json`, i = await fetch(n);
  if (!i.ok)
    throw new Error("Fail to load map json");
  const r = await i.json();
  if (A = Ae(Object.assign(r, A)), A.label = A.label || r.year, A.maptype || (A.maptype = "maplat"), ng(A.maptype)) {
    const o = A.maptype === "base" ? TA : A.maptype === "overlay" ? di : A.maptype === "mapbox" ? hi : A.maptype === "maplibre" ? fi : Dr;
    o.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.imageExtension || (A.imageExtension = "jpg"), Er(A.maptype) ? (delete A.url, delete A.urls) : A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await nr(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
    const g = await o.createAsync(A);
    try {
      return await g.initialWait, g;
    } catch {
      return g;
    }
  }
  if (delete A.homePos, delete A.defZoom, A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), !A.compiled || !A.compiled.wh)
    throw console.error(
      `[Maplat] Missing compiled.wh for mapID=${A.mapID}. Check map setting file: ${n}`
    ), new Error(`Map ${A.mapID} is missing compiled data.`);
  A.width = A.width || A.compiled.wh[0], A.height = A.height || A.compiled.wh[1], A.weiwudi = await nr(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
  const s = await mi.createAsync(A);
  return await s.initialWait, await new Promise((o) => {
    s.setupMapParameter(() => o());
  }), s;
}
async function nr(A) {
  const t = {};
  if (A.maptype === "mapbox" || A.maptype === "maplibre" || A.maptype === "google" || !A.enableCache || A.noCache === !0) return;
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
    n = await te.registerMap(A.mapID, t);
  } catch {
  }
  return n;
}
function ir(A, t) {
  return A + (Math.random() - 0.5) * t;
}
function Or(A, t) {
  if (A instanceof Array)
    return A.map((n) => Or(n, t));
  const e = Math.pow(10, t);
  return Math.round(A * e) / e;
}
var an = { exports: {} }, rr, ig;
function Oo() {
  if (ig) return rr;
  ig = 1;
  var A = /<%=([\s\S]+?)%>/g;
  return rr = A, rr;
}
var sr, rg;
function rl() {
  if (rg) return sr;
  rg = 1;
  var A = Oo(), t = "[object Null]", e = "[object Symbol]", n = "[object Undefined]", i = /[&<>"']/g, r = RegExp(i.source), s = /<%-([\s\S]+?)%>/g, o = /<%([\s\S]+?)%>/g, g = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, a = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, C = typeof self == "object" && self && self.Object === Object && self, I = a || C || Function("return this")();
  function c(O, tt) {
    for (var Vt = -1, pe = O == null ? 0 : O.length, Xt = Array(pe); ++Vt < pe; )
      Xt[Vt] = tt(O[Vt], Vt, O);
    return Xt;
  }
  function u(O) {
    return function(tt) {
      return O?.[tt];
    };
  }
  var d = u(g), f = Object.prototype, m = f.hasOwnProperty, h = f.toString, w = I.Symbol, S = w ? w.toStringTag : void 0, b = w ? w.prototype : void 0, P = b ? b.toString : void 0, x = {
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
      _: { escape: pt }
    }
  };
  function D(O) {
    return O == null ? O === void 0 ? n : t : S && S in Object(O) ? X(O) : j(O);
  }
  function B(O) {
    if (typeof O == "string")
      return O;
    if (k(O))
      return c(O, B) + "";
    if (U(O))
      return P ? P.call(O) : "";
    var tt = O + "";
    return tt == "0" && 1 / O == -1 / 0 ? "-0" : tt;
  }
  function X(O) {
    var tt = m.call(O, S), Vt = O[S];
    try {
      O[S] = void 0;
      var pe = !0;
    } catch {
    }
    var Xt = h.call(O);
    return pe && (tt ? O[S] = Vt : delete O[S]), Xt;
  }
  function j(O) {
    return h.call(O);
  }
  var k = Array.isArray;
  function G(O) {
    return O != null && typeof O == "object";
  }
  function U(O) {
    return typeof O == "symbol" || G(O) && D(O) == e;
  }
  function q(O) {
    return O == null ? "" : B(O);
  }
  function pt(O) {
    return O = q(O), O && r.test(O) ? O.replace(i, d) : O;
  }
  return sr = x, sr;
}
an.exports;
var sg;
function sl() {
  return sg || (sg = 1, (function(A, t) {
    var e = Oo(), n = rl(), i = "Invalid `variable` option passed into `_.template`", r = "Invalid `imports` option passed into `_.template`", s = 800, o = 16, g = 9007199254740991, a = "[object Arguments]", C = "[object Array]", I = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", d = "[object DOMException]", f = "[object Error]", m = "[object Function]", h = "[object GeneratorFunction]", w = "[object Map]", S = "[object Number]", b = "[object Null]", P = "[object Object]", x = "[object Proxy]", D = "[object RegExp]", B = "[object Set]", X = "[object String]", j = "[object Symbol]", k = "[object Undefined]", G = "[object WeakMap]", U = "[object ArrayBuffer]", q = "[object DataView]", pt = "[object Float32Array]", O = "[object Float64Array]", tt = "[object Int8Array]", Vt = "[object Int16Array]", pe = "[object Int32Array]", Xt = "[object Uint8Array]", Ye = "[object Uint8ClampedArray]", Sn = "[object Uint16Array]", Si = "[object Uint32Array]", Ti = /\b__p \+= '';/g, Pi = /\b(__p \+=) '' \+/g, Q = /(__e\(.*?\)|\b__t\)) \+\n'';/g, xi = /[\\^$.*+?()[\]{}|]/g, Tn = /[()=,{}\[\]\/\s]/, Di = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Bi = /^\[object .+?Constructor\]$/, Oi = /^(?:0|[1-9]\d*)$/, Ke = /($^)/, Pn = /['\n\r\u2028\u2029\\]/g, Y = {};
    Y[pt] = Y[O] = Y[tt] = Y[Vt] = Y[pe] = Y[Xt] = Y[Ye] = Y[Sn] = Y[Si] = !0, Y[a] = Y[C] = Y[U] = Y[c] = Y[q] = Y[u] = Y[f] = Y[m] = Y[w] = Y[S] = Y[P] = Y[D] = Y[B] = Y[X] = Y[G] = !1;
    var xn = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, K = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, BA = typeof self == "object" && self && self.Object === Object && self, H = K || BA || Function("return this")(), Je = t && !t.nodeType && t, ct = Je && !0 && A && !A.nodeType && A, ye = ct && ct.exports === Je, qe = ye && K.process, Zt = (function() {
      try {
        var p = ct && ct.require && ct.require("util").types;
        return p || qe && qe.binding && qe.binding("util");
      } catch {
      }
    })(), OA = Zt && Zt.isTypedArray;
    function $e(p, v, T) {
      switch (T.length) {
        case 0:
          return p.call(v);
        case 1:
          return p.call(v, T[0]);
        case 2:
          return p.call(v, T[0], T[1]);
        case 3:
          return p.call(v, T[0], T[1], T[2]);
      }
      return p.apply(v, T);
    }
    function Dn(p, v) {
      for (var T = -1, Z = p == null ? 0 : p.length; ++T < Z && v(p[T], T, p) !== !1; )
        ;
      return p;
    }
    function tA(p, v) {
      for (var T = -1, Z = p == null ? 0 : p.length, F = Array(Z); ++T < Z; )
        F[T] = v(p[T], T, p);
      return F;
    }
    function zt(p, v) {
      for (var T = -1, Z = Array(p); ++T < p; )
        Z[T] = v(T);
      return Z;
    }
    function ie(p) {
      return function(v) {
        return p(v);
      };
    }
    function re(p, v) {
      return tA(v, function(T) {
        return p[T];
      });
    }
    function LA(p) {
      return "\\" + xn[p];
    }
    function eA(p, v) {
      return p?.[v];
    }
    function Oe(p, v) {
      return function(T) {
        return p(v(T));
      };
    }
    var kA = Function.prototype, Lt = Object.prototype, we = H["__core-js_shared__"], se = kA.toString, xt = Lt.hasOwnProperty, NA = (function() {
      var p = /[^.]+$/.exec(we && we.keys && we.keys.IE_PROTO || "");
      return p ? "Symbol(src)_1." + p : "";
    })(), GA = Lt.toString, jA = se.call(Object), XA = RegExp(
      "^" + se.call(xt).replace(xi, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), Ht = ye ? H.Buffer : void 0, Ut = H.Symbol, ge = Oe(Object.getPrototypeOf, Object), Bn = Lt.propertyIsEnumerable, Qt = Ut ? Ut.toStringTag : void 0, Le = (function() {
      try {
        var p = Xn(Object, "defineProperty");
        return p({}, "", {}), p;
      } catch {
      }
    })(), On = Ht ? Ht.isBuffer : void 0, Ln = Oe(Object.keys, Object), ke = Math.max, AA = Date.now, Dt = Ut ? Ut.prototype : void 0, oe = Dt ? Dt.toString : void 0;
    function ZA(p, v) {
      var T = iA(p), Z = !T && zn(p), F = !T && !Z && HA(p), J = !T && !Z && !F && zi(p), lt = T || Z || F || J, At = lt ? zt(p.length, String) : [], kt = At.length;
      for (var yt in p)
        xt.call(p, yt) && !(lt && // Safari 9 has enumerable `arguments.length` in strict mode.
        (yt == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        F && (yt == "offset" || yt == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        J && (yt == "buffer" || yt == "byteLength" || yt == "byteOffset") || // Skip index properties.
        WA(yt, kt))) && At.push(yt);
      return At;
    }
    function zA(p, v, T) {
      var Z = p[v];
      (!(xt.call(p, v) && Kt(Z, T)) || T === void 0 && !(v in p)) && kn(p, v, T);
    }
    function kn(p, v, T) {
      v == "__proto__" && Le ? Le(p, v, {
        configurable: !0,
        enumerable: !0,
        value: T,
        writable: !0
      }) : p[v] = T;
    }
    function ae(p) {
      return p == null ? p === void 0 ? k : b : Qt && Qt in Object(p) ? FA(p) : ji(p);
    }
    function nA(p) {
      return Ee(p) && ae(p) == a;
    }
    function Nn(p) {
      if (!YA(p) || Ni(p))
        return !1;
      var v = QA(p) ? XA : Bi;
      return v.test(VA(p));
    }
    function UA(p) {
      return Ee(p) && Fn(p.length) && !!Y[ae(p)];
    }
    function Li(p) {
      if (!Gi(p))
        return Ln(p);
      var v = [];
      for (var T in Object(p))
        xt.call(p, T) && T != "constructor" && v.push(T);
      return v;
    }
    function ve(p, v) {
      return Yt(Xi(p, v, Ft), p + "");
    }
    var ki = Le ? function(p, v) {
      return Le(p, "toString", {
        configurable: !0,
        enumerable: !1,
        value: gA(v),
        writable: !0
      });
    } : Ft;
    function Gn(p) {
      if (typeof p == "string")
        return p;
      if (iA(p))
        return tA(p, Gn) + "";
      if (Wn(p))
        return oe ? oe.call(p) : "";
      var v = p + "";
      return v == "0" && 1 / p == -1 / 0 ? "-0" : v;
    }
    function et(p, v, T, Z) {
      var F = !T;
      T || (T = {});
      for (var J = -1, lt = v.length; ++J < lt; ) {
        var At = v[J], kt = Z ? Z(T[At], p[At], At, T, p) : void 0;
        kt === void 0 && (kt = p[At]), F ? kn(T, At, kt) : zA(T, At, kt);
      }
      return T;
    }
    function be(p) {
      return ve(function(v, T) {
        var Z = -1, F = T.length, J = F > 1 ? T[F - 1] : void 0, lt = F > 2 ? T[2] : void 0;
        for (J = p.length > 3 && typeof J == "function" ? (F--, J) : void 0, lt && _A(T[0], T[1], lt) && (J = F < 3 ? void 0 : J, F = 1), v = Object(v); ++Z < F; ) {
          var At = T[Z];
          At && p(v, At, Z, J);
        }
        return v;
      });
    }
    function jn(p, v, T, Z) {
      return p === void 0 || Kt(p, Lt[T]) && !xt.call(Z, T) ? v : p;
    }
    function Xn(p, v) {
      var T = eA(p, v);
      return Nn(T) ? T : void 0;
    }
    function FA(p) {
      var v = xt.call(p, Qt), T = p[Qt];
      try {
        p[Qt] = void 0;
        var Z = !0;
      } catch {
      }
      var F = GA.call(p);
      return Z && (v ? p[Qt] = T : delete p[Qt]), F;
    }
    function WA(p, v) {
      var T = typeof p;
      return v = v ?? g, !!v && (T == "number" || T != "symbol" && Oi.test(p)) && p > -1 && p % 1 == 0 && p < v;
    }
    function _A(p, v, T) {
      if (!YA(T))
        return !1;
      var Z = typeof v;
      return (Z == "number" ? rA(T) && WA(v, T.length) : Z == "string" && v in T) ? Kt(T[v], p) : !1;
    }
    function Ni(p) {
      return !!NA && NA in p;
    }
    function Gi(p) {
      var v = p && p.constructor, T = typeof v == "function" && v.prototype || Lt;
      return p === T;
    }
    function ji(p) {
      return GA.call(p);
    }
    function Xi(p, v, T) {
      return v = ke(v === void 0 ? p.length - 1 : v, 0), function() {
        for (var Z = arguments, F = -1, J = ke(Z.length - v, 0), lt = Array(J); ++F < J; )
          lt[F] = Z[v + F];
        F = -1;
        for (var At = Array(v + 1); ++F < v; )
          At[F] = Z[F];
        return At[v] = T(lt), $e(p, this, At);
      };
    }
    var Yt = Zn(ki);
    function Zn(p) {
      var v = 0, T = 0;
      return function() {
        var Z = AA(), F = o - (Z - T);
        if (T = Z, F > 0) {
          if (++v >= s)
            return arguments[0];
        } else
          v = 0;
        return p.apply(void 0, arguments);
      };
    }
    function VA(p) {
      if (p != null) {
        try {
          return se.call(p);
        } catch {
        }
        try {
          return p + "";
        } catch {
        }
      }
      return "";
    }
    function Kt(p, v) {
      return p === v || p !== p && v !== v;
    }
    var zn = nA(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? nA : function(p) {
      return Ee(p) && xt.call(p, "callee") && !Bn.call(p, "callee");
    }, iA = Array.isArray;
    function rA(p) {
      return p != null && Fn(p.length) && !QA(p);
    }
    var HA = On || Ge;
    function Un(p) {
      if (!Ee(p))
        return !1;
      var v = ae(p);
      return v == f || v == d || typeof p.message == "string" && typeof p.name == "string" && !Zi(p);
    }
    function QA(p) {
      if (!YA(p))
        return !1;
      var v = ae(p);
      return v == m || v == h || v == I || v == x;
    }
    function Fn(p) {
      return typeof p == "number" && p > -1 && p % 1 == 0 && p <= g;
    }
    function YA(p) {
      var v = typeof p;
      return p != null && (v == "object" || v == "function");
    }
    function Ee(p) {
      return p != null && typeof p == "object";
    }
    function Zi(p) {
      if (!Ee(p) || ae(p) != P)
        return !1;
      var v = ge(p);
      if (v === null)
        return !0;
      var T = xt.call(v, "constructor") && v.constructor;
      return typeof T == "function" && T instanceof T && se.call(T) == jA;
    }
    function Wn(p) {
      return typeof p == "symbol" || Ee(p) && ae(p) == j;
    }
    var zi = OA ? ie(OA) : UA;
    function _n(p) {
      return p == null ? "" : Gn(p);
    }
    var sA = be(function(p, v, T, Z) {
      et(v, Ne(v), p, Z);
    });
    function Ne(p) {
      return rA(p) ? ZA(p) : Li(p);
    }
    function KA(p, v, T) {
      var Z = n.imports._.templateSettings || n;
      T && _A(p, v, T) && (v = void 0), p = _n(p), v = sA({}, v, Z, jn);
      var F = sA({}, v.imports, Z.imports, jn), J = Ne(F), lt = re(F, J);
      Dn(J, function(R) {
        if (Tn.test(R))
          throw new Error(r);
      });
      var At, kt, yt = 0, Hn = v.interpolate || Ke, ut = "__p += '", Qn = RegExp(
        (v.escape || Ke).source + "|" + Hn.source + "|" + (Hn === e ? Di : Ke).source + "|" + (v.evaluate || Ke).source + "|$",
        "g"
      ), JA = xt.call(v, "sourceURL") ? "//# sourceURL=" + (v.sourceURL + "").replace(/\s/g, " ") + `
` : "";
      p.replace(Qn, function(R, l, y, M, E, L) {
        return y || (y = M), ut += p.slice(yt, L).replace(Pn, LA), l && (At = !0, ut += `' +
__e(` + l + `) +
'`), E && (kt = !0, ut += `';
` + E + `;
__p += '`), y && (ut += `' +
((__t = (` + y + `)) == null ? '' : __t) +
'`), yt = L + R.length, R;
      }), ut += `';
`;
      var Jt = xt.call(v, "variable") && v.variable;
      if (!Jt)
        ut = `with (obj) {
` + ut + `
}
`;
      else if (Tn.test(Jt))
        throw new Error(i);
      ut = (kt ? ut.replace(Ti, "") : ut).replace(Pi, "$1").replace(Q, "$1;"), ut = "function(" + (Jt || "obj") + `) {
` + (Jt ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (At ? ", __e = _.escape" : "") + (kt ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + ut + `return __p
}`;
      var Me = Vn(function() {
        return Function(J, JA + "return " + ut).apply(void 0, lt);
      });
      if (Me.source = ut, Un(Me))
        throw Me;
      return Me;
    }
    var Vn = ve(function(p, v) {
      try {
        return $e(p, void 0, v);
      } catch (T) {
        return Un(T) ? T : new Error(T);
      }
    });
    function gA(p) {
      return function() {
        return p;
      };
    }
    function Ft(p) {
      return p;
    }
    function Ge() {
      return !1;
    }
    A.exports = KA;
  })(an, an.exports)), an.exports;
}
var gl = sl();
const Lo = /* @__PURE__ */ iI(gl);
function gg(A, ...t) {
  const e = Ae(Object.assign({}, A));
  if (e.icon) return e;
  const n = t.reduce((i, r) => {
    if (i) return i;
    const s = r.iconTemplate;
    if (s)
      return JSON.parse(Lo(s)(e));
    if (r.icon)
      return {
        icon: r.icon,
        selectedIcon: r.selectedIcon
      };
  }, void 0);
  return n && (e.icon = n.icon, e.selectedIcon = n.selectedIcon), e;
}
function og(A, ...t) {
  return A = Ae(A), A.html ? A : t.reduce((e, n) => {
    if (e) return e;
    const i = n.poiTemplate;
    if (i)
      return A.html = Lo(i)(A), A.poiStyle = A.poiStyle || n.poiStyle, A;
  }, void 0) || A;
}
const gt = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, ol = {
  ERROR: "error"
};
class al extends de {
  code;
  message;
  constructor(t) {
    super(ol.ERROR), this.code = t.code, this.message = t.message;
  }
}
class Il extends PA {
  task_id_;
  timer_base_ = !1;
  home_position_ = !1;
  constructor(t) {
    super(), t = t || {}, this.timer_base_ = t.timerBase !== void 0 ? t.timerBase : !1, this.task_id_ = void 0, this.home_position_ = t.homePosition !== void 0 ? t.homePosition : !1, this.addChangeListener(gt.TRACKING, this.handleTrackingChanged_), t.trackingOptions !== void 0 ? this.setTrackingOptions(t.trackingOptions) : this.setTrackingOptions({
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
      longitude: ir(this.home_position_[0], 0.05),
      latitude: ir(this.home_position_[1], 0.05),
      accuracy: ir(15, 10)
    };
    this.positionChange_({ coords: t });
  }
  positionChange_(t) {
    const e = t.coords;
    this.set(gt.ACCURACY, e.accuracy), this.set(
      gt.ALTITUDE,
      e.altitude === null ? void 0 : e.altitude
    ), this.set(
      gt.ALTITUDE_ACCURACY,
      e.altitudeAccuracy === null ? void 0 : e.altitudeAccuracy
    ), this.set(
      gt.HEADING,
      e.heading === null ? void 0 : wA(e.heading)
    ), this.set(gt.POSITION, [e.longitude, e.latitude]), this.set(gt.SPEED, e.speed === null ? void 0 : e.speed), this.changed();
  }
  timerPositionError_() {
    const t = Math.floor(Math.random() * 3) + 1, e = {
      code: t,
      message: t === 1 ? "User denied Geolocation" : t === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(e);
  }
  positionError_(t) {
    const e = new al(t);
    this.dispatchEvent(e);
  }
  getAccuracy() {
    return this.get(gt.ACCURACY);
  }
  getAltitude() {
    return this.get(gt.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(gt.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(gt.HEADING);
  }
  getPosition() {
    return this.get(gt.POSITION);
  }
  getSpeed() {
    return this.get(gt.SPEED);
  }
  getTracking() {
    return this.get(gt.TRACKING);
  }
  getTrackingOptions() {
    return this.get(gt.TRACKING_OPTIONS);
  }
  setTracking(t) {
    this.set(gt.TRACKING, t);
  }
  setTrackingOptions(t) {
    this.set(gt.TRACKING_OPTIONS, t);
  }
}
const ko = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", No = "data:image/png;base64,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";
function ag(A, t) {
  (t == null || t > A.length) && (t = A.length);
  for (var e = 0, n = Array(t); e < t; e++) n[e] = A[e];
  return n;
}
function Cl(A) {
  if (Array.isArray(A)) return A;
}
function cl(A, t) {
  var e = A == null ? null : typeof Symbol < "u" && A[Symbol.iterator] || A["@@iterator"];
  if (e != null) {
    var n, i, r, s, o = [], g = !0, a = !1;
    try {
      if (r = (e = e.call(A)).next, t !== 0) for (; !(g = (n = r.call(e)).done) && (o.push(n.value), o.length !== t); g = !0) ;
    } catch (C) {
      a = !0, i = C;
    } finally {
      try {
        if (!g && e.return != null && (s = e.return(), Object(s) !== s)) return;
      } finally {
        if (a) throw i;
      }
    }
    return o;
  }
}
function ll() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ul(A, t) {
  return Cl(A) || cl(A, t) || hl(A, t) || ll();
}
function hl(A, t) {
  if (A) {
    if (typeof A == "string") return ag(A, t);
    var e = {}.toString.call(A).slice(8, -1);
    return e === "Object" && A.constructor && (e = A.constructor.name), e === "Map" || e === "Set" ? Array.from(A) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? ag(A, t) : void 0;
  }
}
const Go = Object.entries, Ig = Object.setPrototypeOf, fl = Object.isFrozen, jo = Object.getPrototypeOf, Xo = Object.getOwnPropertyDescriptor;
let st = Object.freeze, Ct = Object.seal, dA = Object.create, Zo = typeof Reflect < "u" && Reflect, Lr = Zo.apply, kr = Zo.construct;
st || (st = function(t) {
  return t;
});
Ct || (Ct = function(t) {
  return t;
});
Lr || (Lr = function(t, e) {
  for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++) i[r - 2] = arguments[r];
  return t.apply(e, i);
});
kr || (kr = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) n[i - 1] = arguments[i];
  return new t(...n);
});
const Ce = $(Array.prototype.forEach), dl = $(Array.prototype.lastIndexOf), Cg = $(Array.prototype.pop), en = $(Array.prototype.push), ml = $(Array.prototype.slice), pl = $(Array.prototype.splice), EA = Array.isArray, gr = zo(Set), or = $(Set.prototype.add), An = $(Set.prototype.has), Ze = $(String.prototype.toLowerCase), ar = $(String.prototype.toString), cg = $(String.prototype.match), nn = $(String.prototype.replace), lg = $(String.prototype.indexOf), yl = $(String.prototype.trim), wl = $(Number.prototype.toString), vl = $(Boolean.prototype.toString), ug = typeof BigInt > "u" ? null : $(BigInt.prototype.toString), hg = typeof Symbol > "u" ? null : $(Symbol.prototype.toString), Pt = $(Object.prototype.hasOwnProperty), rn = $(Object.prototype.toString), ot = $(RegExp.prototype.test), ce = zo(TypeError);
function $(A) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) n[i - 1] = arguments[i];
    return Lr(A, t, n);
  };
}
function zo(A) {
  return function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
    return kr(A, e);
  };
}
function W(A, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ze;
  if (Ig && Ig(A, null), !EA(t)) return A;
  let n = t.length;
  for (; n--; ) {
    let i = t[n];
    if (typeof i == "string") {
      const r = e(i);
      r !== i && (fl(t) || (t[n] = r), i = r);
    }
    A[i] = !0;
  }
  return A;
}
function bl(A) {
  for (let t = 0; t < A.length; t++) Pt(A, t) || (A[t] = null);
  return A;
}
function Bt(A) {
  const t = dA(null);
  for (const n of Go(A)) {
    var e = ul(n, 2);
    const i = e[0], r = e[1];
    Pt(A, i) && (EA(r) ? t[i] = bl(r) : r && typeof r == "object" && r.constructor === Object ? t[i] = Bt(r) : t[i] = r);
  }
  return t;
}
function El(A) {
  switch (typeof A) {
    case "string":
      return A;
    case "number":
      return wl(A);
    case "boolean":
      return vl(A);
    case "bigint":
      return ug ? ug(A) : "0";
    case "symbol":
      return hg ? hg(A) : "Symbol()";
    case "undefined":
      return rn(A);
    case "function":
    case "object": {
      if (A === null) return rn(A);
      const t = A, e = Nt(t, "toString");
      if (typeof e == "function") {
        const n = e(t);
        return typeof n == "string" ? n : rn(n);
      }
      return rn(A);
    }
    default:
      return rn(A);
  }
}
function Nt(A, t) {
  for (; A !== null; ) {
    const n = Xo(A, t);
    if (n) {
      if (n.get) return $(n.get);
      if (typeof n.value == "function") return $(n.value);
    }
    A = jo(A);
  }
  function e() {
    return null;
  }
  return e;
}
function Ml(A, t) {
  for (; A !== null; ) {
    const e = Xo(A, t);
    if (e) return e.get ? $(e.get) : null;
    A = jo(A);
  }
  return null;
}
function Rl(A) {
  try {
    return ot(A, ""), !0;
  } catch {
    return !1;
  }
}
const fg = st([
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
]), Ir = st([
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
]), Cr = st([
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
]), Sl = st([
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
]), cr = st([
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
]), Tl = st([
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
]), dg = st(["#text"]), mg = st([
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
]), lr = st([
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
]), pg = st([
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
]), gi = st([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Pl = Ct(/{{[\w\W]*|^[\w\W]*}}/g), xl = Ct(/<%[\w\W]*|^[\w\W]*%>/g), Dl = Ct(/\${[\w\W]*/g), Bl = Ct(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ol = Ct(/^aria-[\-\w]+$/), yg = Ct(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Ll = Ct(/^(?:\w+script|data):/i), kl = Ct(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Nl = Ct(/^html$/i), Gl = Ct(/^[a-z][.\w]*(-[.\w]+)+$/i), ur = Ct(/<[/\w!]/g), wg = Ct(/<[/\w]/g), jl = Ct(/<\/no(script|embed|frames)/i), vg = Ct(/\/>/i), nt = {
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
}, Xl = st(W({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), Zl = function() {
  return typeof window > "u" ? null : window;
}, zl = function(t, e) {
  if (typeof t != "object" || typeof t.createPolicy != "function") return null;
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
}, bg = function() {
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
}, Te = function(t, e, n, i) {
  return Pt(t, e) && EA(t[e]) ? W(i.base ? Bt(i.base) : {}, t[e], i.transform) : n;
}, hr = function(t, e, n) {
  const i = Pt(t, e) ? t[e] : void 0;
  return i && typeof i == "object" ? Bt(i) : n();
};
function Uo() {
  let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Zl();
  const t = (R) => Uo(R);
  if (t.version = "3.4.17", t.removed = [], !A || !A.document || A.document.nodeType !== nt.document || !A.Element)
    return t.isSupported = !1, t;
  let e = A.document;
  const n = e, i = n.currentScript;
  A.DocumentFragment;
  const r = A.HTMLTemplateElement, s = A.Node, o = A.Element, g = A.NodeFilter;
  A.NamedNodeMap === void 0 && (A.NamedNodeMap || A.MozNamedAttrMap), A.HTMLFormElement;
  const a = A.DOMParser, C = A.trustedTypes, I = o.prototype, c = Nt(I, "cloneNode"), u = Nt(I, "remove"), d = Nt(I, "removeAttributeNode"), f = Nt(I, "nextSibling"), m = Nt(I, "childNodes"), h = Nt(I, "parentNode"), w = Nt(I, "shadowRoot"), S = Nt(I, "attributes"), b = s && s.prototype ? Nt(s.prototype, "nodeType") : null, P = s && s.prototype ? Nt(s.prototype, "nodeName") : null, x = s && s.prototype ? Nt(s.prototype, "ownerDocument") : null, D = function(l) {
    return b ? b(l) : l.nodeType;
  }, B = function(l) {
    return P ? P(l) : l.nodeName;
  }, X = Ml(I, "namespaceURI"), j = function(l) {
    return X ? X(l) : l.namespaceURI;
  };
  if (typeof r == "function") {
    const R = e.createElement("template");
    R.content && R.content.ownerDocument && (e = R.content.ownerDocument);
  }
  let k, G = "", U, q = !1, pt = 0;
  const O = function() {
    if (pt > 0) throw ce('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, tt = function(l) {
    O(), pt++;
    try {
      return k.createHTML(l);
    } finally {
      pt--;
    }
  }, Vt = function(l) {
    O(), pt++;
    try {
      return k.createScriptURL(l);
    } finally {
      pt--;
    }
  }, pe = function() {
    return q || (U = zl(C, i), q = !0), U;
  }, Xt = e, Ye = Xt.implementation, Sn = Xt.createNodeIterator, Si = Xt.createDocumentFragment, Ti = Xt.getElementsByTagName, Pi = n.importNode;
  let Q = bg();
  t.isSupported = typeof Go == "function" && typeof h == "function" && Ye && Ye.createHTMLDocument !== void 0;
  const xi = Pl, Tn = xl, Di = Dl, Bi = Bl, Oi = Ol, Ke = Ll, Pn = kl, Y = Gl;
  let xn = yg, K = null;
  const BA = W({}, [
    ...fg,
    ...Ir,
    ...Cr,
    ...cr,
    ...dg
  ]);
  let H = null;
  const Je = W({}, [
    ...mg,
    ...lr,
    ...pg,
    ...gi
  ]);
  let ct = Object.seal(dA(null, {
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
  })), ye = null, qe = null;
  const Zt = Object.seal(dA(null, {
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
  let OA = !0, $e = !0, Dn = !1, tA = !0, zt = !1, ie = !0, re = !1, LA = !1, eA = null, Oe = null, kA = !1, Lt = !1, we = !1, se = !1, xt = !0, NA = !1;
  const GA = "user-content-";
  let jA = !0, XA = !1, Ht = null, Ut = {}, ge = null;
  const Bn = W({}, [
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
  let Qt = null;
  const Le = W({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let On = null;
  const Ln = W({}, [
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
  ]), ke = "http://www.w3.org/1998/Math/MathML", AA = "http://www.w3.org/2000/svg", Dt = "http://www.w3.org/1999/xhtml";
  let oe = Dt, ZA = !1, zA = null;
  const kn = W({}, [
    ke,
    AA,
    Dt
  ], ar), ae = st([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let nA = W({}, ae);
  const Nn = st(["annotation-xml"]);
  let UA = W({}, Nn);
  const Li = W({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let ve = null;
  const ki = ["application/xhtml+xml", "text/html"], Gn = "text/html";
  let et = null, be = null;
  const jn = e.createElement("form"), Xn = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, FA = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (be && be === l) return;
    (!l || typeof l != "object") && (l = {}), l = Bt(l), ve = ki.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? Gn : l.PARSER_MEDIA_TYPE, et = ve === "application/xhtml+xml" ? ar : Ze, K = Te(l, "ALLOWED_TAGS", BA, { transform: et }), H = Te(l, "ALLOWED_ATTR", Je, { transform: et }), zA = Te(l, "ALLOWED_NAMESPACES", kn, { transform: ar }), On = Te(l, "ADD_URI_SAFE_ATTR", Ln, {
      transform: et,
      base: Ln
    }), Qt = Te(l, "ADD_DATA_URI_TAGS", Le, {
      transform: et,
      base: Le
    }), ge = Te(l, "FORBID_CONTENTS", Bn, { transform: et }), ye = Te(l, "FORBID_TAGS", Bt({}), { transform: et }), qe = Te(l, "FORBID_ATTR", Bt({}), { transform: et }), Ut = Pt(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? Bt(l.USE_PROFILES) : l.USE_PROFILES : !1, OA = l.ALLOW_ARIA_ATTR !== !1, $e = l.ALLOW_DATA_ATTR !== !1, Dn = l.ALLOW_UNKNOWN_PROTOCOLS || !1, tA = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, zt = l.SAFE_FOR_TEMPLATES || !1, ie = l.SAFE_FOR_XML !== !1, re = l.WHOLE_DOCUMENT || !1, Lt = l.RETURN_DOM || !1, we = l.RETURN_DOM_FRAGMENT || !1, se = l.RETURN_TRUSTED_TYPE || !1, kA = l.FORCE_BODY || !1, xt = l.SANITIZE_DOM !== !1, NA = l.SANITIZE_NAMED_PROPS || !1, jA = l.KEEP_CONTENT !== !1, XA = l.IN_PLACE || !1, xn = Rl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : yg, oe = typeof l.NAMESPACE == "string" ? l.NAMESPACE : Dt, nA = hr(l, "MATHML_TEXT_INTEGRATION_POINTS", () => W({}, ae)), UA = hr(l, "HTML_INTEGRATION_POINTS", () => W({}, Nn));
    const y = hr(l, "CUSTOM_ELEMENT_HANDLING", () => dA(null));
    if (ct = dA(null), Pt(y, "tagNameCheck") && Xn(y.tagNameCheck) && (ct.tagNameCheck = y.tagNameCheck), Pt(y, "attributeNameCheck") && Xn(y.attributeNameCheck) && (ct.attributeNameCheck = y.attributeNameCheck), Pt(y, "allowCustomizedBuiltInElements") && typeof y.allowCustomizedBuiltInElements == "boolean" && (ct.allowCustomizedBuiltInElements = y.allowCustomizedBuiltInElements), Ct(ct), zt && ($e = !1), we && (Lt = !0), Ut && (K = W({}, dg), H = dA(null), Ut.html === !0 && (W(K, fg), W(H, mg)), Ut.svg === !0 && (W(K, Ir), W(H, lr), W(H, gi)), Ut.svgFilters === !0 && (W(K, Cr), W(H, lr), W(H, gi)), Ut.mathMl === !0 && (W(K, cr), W(H, pg), W(H, gi))), Zt.tagCheck = null, Zt.attributeCheck = null, Pt(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? Zt.tagCheck = l.ADD_TAGS : EA(l.ADD_TAGS) && (K === BA && (K = Bt(K)), W(K, l.ADD_TAGS, et))), Pt(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? Zt.attributeCheck = l.ADD_ATTR : EA(l.ADD_ATTR) && (H === Je && (H = Bt(H)), W(H, l.ADD_ATTR, et))), Pt(l, "ADD_FORBID_CONTENTS") && EA(l.ADD_FORBID_CONTENTS) && (ge === Bn && (ge = Bt(ge)), W(ge, l.ADD_FORBID_CONTENTS, et)), jA && (K["#text"] = !0), re && W(K, [
      "html",
      "head",
      "body"
    ]), K.table && (W(K, ["tbody"]), delete ye.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw ce('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw ce('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const M = k;
      k = l.TRUSTED_TYPES_POLICY;
      try {
        G = tt("");
      } catch (E) {
        throw k = M, E;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (k = void 0, G = "") : (k === void 0 && (k = pe()), k && typeof G == "string" && (G = tt("")));
    st && st(l), be = l;
  }, WA = W({}, [
    ...Ir,
    ...Cr,
    ...Sl
  ]), _A = W({}, [...cr, ...Tl]), Ni = function(l, y, M) {
    return y.namespaceURI === Dt ? l === "svg" : y.namespaceURI === ke ? l === "svg" && (M === "annotation-xml" || nA[M]) : !!WA[l];
  }, Gi = function(l, y, M) {
    return y.namespaceURI === Dt ? l === "math" : y.namespaceURI === AA ? l === "math" && UA[M] : !!_A[l];
  }, ji = function(l, y, M) {
    return y.namespaceURI === AA && !UA[M] || y.namespaceURI === ke && !nA[M] ? !1 : !_A[l] && (Li[l] || !WA[l]);
  }, Xi = function(l) {
    const y = j(l), M = Ze(B(l)), E = h(l);
    let L, N;
    return E && D(E) === nt.element ? (L = { namespaceURI: j(E) }, N = Ze(B(E))) : (L = { namespaceURI: oe }, N = "template"), zA[y] ? y === AA ? Ni(M, L, N) : y === ke ? Gi(M, L, N) : y === Dt ? ji(M, L, N) : !!(ve === "application/xhtml+xml" && zA[y]) : !1;
  }, Yt = function(l) {
    en(t.removed, { element: l });
    try {
      h(l).removeChild(l);
    } catch {
      if (u(l), !h(l)) throw ce("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Zn = function(l, y, M) {
    try {
      d(l, y);
    } catch {
      try {
        l.removeAttribute(M);
      } catch {
      }
    }
  }, VA = function(l) {
    rA(l);
    const y = m(l);
    y && Ce(ml(y), (E) => {
      try {
        u(E);
      } catch {
      }
    });
    const M = D(l) === nt.element ? S(l) : null;
    if (M) for (let E = M.length - 1; E >= 0; --E) {
      const L = M[E], N = L && L.name;
      typeof N == "string" && Zn(l, L, N);
    }
  }, Kt = function(l, y, M) {
    if (!M) try {
      M = y.getAttributeNode(l);
    } catch {
      M = null;
    }
    en(t.removed, {
      attribute: M || null,
      from: y
    });
    try {
      M ? d(y, M) : y.removeAttribute(l);
    } catch {
      try {
        y.removeAttribute(l);
      } catch {
      }
    }
    if (l === "is")
      if (Lt || we) try {
        Yt(y);
      } catch {
      }
      else try {
        y.setAttribute(l, "");
      } catch {
      }
  }, zn = function(l) {
    const y = S(l);
    if (y)
      for (let M = y.length - 1; M >= 0; --M) {
        const E = y[M], L = E && E.name;
        typeof L != "string" || H[et(L)] || Zn(l, E, L);
      }
  }, iA = function(l, y) {
    let M = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const E = [l];
    for (; E.length > 0; ) {
      const L = E.pop();
      if (y(L) === !1) continue;
      if (M && D(L) === nt.element) {
        const z = w(L);
        Ft(z) && E.push(z);
      }
      const N = m(L);
      if (N) for (let z = N.length - 1; z >= 0; --z) E.push(N[z]);
    }
  }, rA = function(l) {
    iA(l, (y) => {
      D(y) === nt.element && zn(y);
    });
  }, HA = function(l) {
    const y = [];
    return iA(l, (M) => {
      y.push(M);
    }, !0), y;
  }, Un = function(l, y) {
    const M = gr();
    Ce(HA(l), (E) => {
      D(E) === nt.element && or(M, E);
    }), Ce(y, (E) => {
      D(E) === nt.element && !An(M, E) && zn(E);
    });
  }, QA = function(l, y) {
    let M = !1;
    return Ce(t.removed, (E) => {
      E.element && (M = M || E.element === l, rA(E.element));
    }), Un(l, y), M;
  }, Fn = 8, YA = function(l, y) {
    const M = Ht;
    let E = null;
    const L = () => (E || (E = gr(), Ce(y, (N) => {
      or(E, N);
    })), E);
    for (let N = 0; ; N++) {
      const z = HA(l), it = [l];
      let qt = !1;
      if (Ce(z, (wt) => {
        D(wt) === nt.documentFragment ? en(it, wt) : !qt && !An(M, wt) && (qt = An(L(), wt));
      }), !qt) return;
      if (N >= Fn) throw ce("the tree kept changing during in-place sanitization; refusing to return it");
      Ce(it, (wt, St) => {
        Ee(wt, St > 0, l, L());
      });
    }
  }, Ee = function(l, y, M, E) {
    const L = sA(l);
    let N;
    for (; N = L.nextNode(); )
      !An(E, N) || An(Ht, N) || (y && p(Q.uponSanitizeShadowNode, N, null), lt(N, M), JA(N, M), Ft(N.content) && Jt(N.content));
  }, Zi = function(l) {
    Ht && or(Ht, l);
  }, Wn = function(l, y) {
    return ie ? l === "patchsrc" ? !0 : l === "for" && y !== "label" && y !== "output" : !1;
  }, zi = function(l) {
    ie && iA(l, (y) => {
      const M = D(y);
      if (M === nt.processingInstruction || M === nt.comment && ot(wg, y.data)) {
        try {
          u(y);
        } catch {
        }
        return !1;
      }
      if (M === nt.element) {
        const E = y, L = et(B(y));
        try {
          E.hasAttribute && E.hasAttribute("patchsrc") && E.removeAttribute("patchsrc"), E.hasAttribute && E.hasAttribute("for") && Wn("for", L) && E.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, _n = function(l) {
    let y = null, M = null;
    if (kA) l = "<remove></remove>" + l;
    else {
      const N = cg(l, /^[\r\n\t ]+/);
      M = N && N[0];
    }
    ve === "application/xhtml+xml" && oe === Dt && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const E = k ? tt(l) : l;
    if (oe === Dt) try {
      y = new a().parseFromString(E, ve);
    } catch {
    }
    if (!y || !y.documentElement) {
      y = Ye.createDocument(oe, "template", null);
      try {
        y.documentElement.innerHTML = ZA ? G : E;
      } catch {
      }
    }
    const L = y.body || y.documentElement;
    return l && M && L.insertBefore(e.createTextNode(M), L.childNodes[0] || null), oe === Dt ? Ti.call(y, re ? "html" : "body")[0] : re ? y.documentElement : L;
  }, sA = function(l) {
    const y = x ? x(l) : l.ownerDocument;
    return Sn.call(y || l, l, g.SHOW_ELEMENT | g.SHOW_COMMENT | g.SHOW_TEXT | g.SHOW_PROCESSING_INSTRUCTION | g.SHOW_CDATA_SECTION, null);
  }, Ne = function(l) {
    return l = nn(l, xi, " "), l = nn(l, Tn, " "), l = nn(l, Di, " "), l;
  }, KA = function(l) {
    var y;
    Vn(l);
    const M = (y = l.querySelectorAll) === null || y === void 0 ? void 0 : y.call(l, "template");
    M && Ce(M, (E) => {
      Ft(E.content) && KA(E.content);
    });
  }, Vn = function(l) {
    l.normalize();
    const y = x ? x(l) : l.ownerDocument, M = Sn.call(y || l, l, g.SHOW_TEXT | g.SHOW_COMMENT | g.SHOW_CDATA_SECTION | g.SHOW_PROCESSING_INSTRUCTION, null);
    let E = M.nextNode();
    for (; E; )
      E.data = Ne(E.data), E = M.nextNode();
  }, gA = function(l) {
    const y = P ? P(l) : null;
    return typeof y != "string" || et(y) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== S(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== b(l) || l.childNodes !== m(l);
  }, Ft = function(l) {
    if (!b || typeof l != "object" || l === null) return !1;
    try {
      return b(l) === nt.documentFragment;
    } catch {
      return !1;
    }
  }, Ge = function(l) {
    if (!b || typeof l != "object" || l === null) return !1;
    try {
      return typeof b(l) == "number";
    } catch {
      return !1;
    }
  };
  function p(R, l, y) {
    R.length !== 0 && Ce(R, (M) => {
      M.call(t, l, y, be);
    });
  }
  const v = function(l, y) {
    return !!(ie && l.hasChildNodes() && !Ge(l.firstElementChild) && ot(ur, l.textContent) && ot(ur, l.innerHTML) || ie && Xl[y] && D(l) === nt.element && j(l) === Dt && (Ge(l.firstElementChild) || typeof l.textContent == "string" && ot(ur, l.textContent)) || l.nodeType === nt.processingInstruction || ie && l.nodeType === nt.comment && ot(wg, l.data));
  }, T = function(l, y) {
    if (l instanceof RegExp) return ot(l, y);
    if (l instanceof Function) {
      for (var M = arguments.length, E = new Array(M > 2 ? M - 2 : 0), L = 2; L < M; L++) E[L - 2] = arguments[L];
      return !!l(y, ...E);
    }
    return !1;
  }, Z = function(l, y, M) {
    if (!ye[y] && yt(y) && T(ct.tagNameCheck, y)) return !1;
    if (jA && !ge[y] && !ge[Ze(y)]) {
      const E = h(l), L = m(l);
      if (L && E) {
        const N = L.length;
        for (let z = N - 1; z >= 0; --z) {
          const it = l === M ? c(L[z], !0) : L[z];
          E.insertBefore(it, f(l));
        }
      }
    }
    return Yt(l), !0;
  }, F = function(l, y, M, E) {
    return l.length === 0 ? y : y === M || y === E ? Bt(y) : y;
  }, J = function(l, y) {
    return l === y || h(l) !== null ? !1 : (XA && rA(l), !0);
  }, lt = function(l, y) {
    if (Zi(l), p(Q.beforeSanitizeElements, l, null), J(l, y)) return !0;
    if (gA(l))
      return Yt(l), !0;
    const M = et(B(l));
    if (K = F(Q.uponSanitizeElement, K, BA, eA), p(Q.uponSanitizeElement, l, {
      tagName: M,
      allowedTags: K
    }), J(l, y)) return !0;
    if (v(l, M))
      return Yt(l), !0;
    if (ye[M] || !(Zt.tagCheck instanceof Function && Zt.tagCheck(M)) && !K[M]) {
      const E = Z(l, M, y);
      return E === !1 && (p(Q.afterSanitizeElements, l, null), J(l, y)) ? !0 : E;
    }
    if (D(l) === nt.element && !Xi(l) || (M === "noscript" || M === "noembed" || M === "noframes") && ot(jl, l.innerHTML))
      return Yt(l), !0;
    if (zt && l.nodeType === nt.text) {
      const E = Ne(l.textContent);
      l.textContent !== E && (en(t.removed, { element: l.cloneNode() }), l.textContent = E);
    }
    return p(Q.afterSanitizeElements, l, null), J(l, y);
  }, At = function(l, y, M) {
    if (qe[y] || Wn(y, l) || xt && (y === "id" || y === "name") && (M in e || M in jn)) return !1;
    const E = H[y] || Zt.attributeCheck instanceof Function && Zt.attributeCheck(y, l);
    return $e && ot(Bi, y) || OA && ot(Oi, y) ? !0 : E ? On[y] || ot(xn, nn(M, Pn, "")) || (y === "src" || y === "xlink:href" || y === "href") && l !== "script" && lg(M, "data:") === 0 && Qt[l] || Dn && !ot(Ke, nn(M, Pn, "")) ? !0 : !M : yt(l) && T(ct.tagNameCheck, l) && T(ct.attributeNameCheck, y, l) || y === "is" && ct.allowCustomizedBuiltInElements && T(ct.tagNameCheck, M);
  }, kt = W({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), yt = function(l) {
    return !kt[Ze(l)] && ot(Y, l);
  }, Hn = function(l, y, M, E) {
    if (k && typeof C == "object" && typeof C.getAttributeType == "function" && !M) switch (C.getAttributeType(l, y)) {
      case "TrustedHTML":
        return tt(E);
      case "TrustedScriptURL":
        return Vt(E);
    }
    return E;
  }, ut = function(l, y, M, E) {
    try {
      return M ? l.setAttributeNS(M, y, E) : l.setAttribute(y, E), gA(l) ? (Yt(l), !1) : !0;
    } catch {
      return Kt(y, l), !1;
    }
  }, Qn = function(l, y) {
    return ie && ot(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, y) ? !0 : Ze(l) === "attributename" && cg(y, "href") !== null;
  }, JA = function(l, y) {
    if (p(Q.beforeSanitizeAttributes, l, null), J(l, y)) return;
    const M = l.attributes;
    if (!M || gA(l)) return;
    H = F(Q.uponSanitizeAttribute, H, Je, Oe);
    const E = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: H,
      forceKeepAttr: void 0
    };
    let L = M.length;
    const N = et(l.nodeName);
    for (; L--; ) {
      const z = M[L], it = z.name, qt = z.namespaceURI, wt = z.value, St = et(it), oA = wt;
      let Tt = it === "value" ? oA : yl(oA), ss = !1;
      if (E.attrName = St, E.attrValue = Tt, E.keepAttr = !0, E.forceKeepAttr = void 0, p(Q.uponSanitizeAttribute, l, E), Tt = E.attrValue, NA && (St === "id" || St === "name") && lg(Tt, GA) !== 0 && (Kt(it, l, z), Tt = GA + Tt, ss = !0), Qn(it, Tt)) {
        Kt(it, l, z);
        continue;
      }
      if (!E.forceKeepAttr) {
        if (!E.keepAttr) {
          Kt(it, l, z);
          continue;
        }
        if (!tA && ot(vg, Tt)) {
          Kt(it, l, z);
          continue;
        }
        if (zt && (Tt = Ne(Tt)), !At(N, St, Tt)) {
          Kt(it, l, z);
          continue;
        }
        Tt = Hn(N, St, qt, Tt), Tt !== oA && ut(l, it, qt, Tt) && ss && Cg(t.removed);
      }
    }
    p(Q.afterSanitizeAttributes, l, null), J(l, y);
  }, Jt = function(l) {
    let y = null;
    const M = sA(l);
    for (p(Q.beforeSanitizeShadowDOM, l, null); y = M.nextNode(); )
      if (p(Q.uponSanitizeShadowNode, y, null), lt(y, l), JA(y, l), Ft(y.content) && Jt(y.content), D(y) === nt.element) {
        const E = w(y);
        Ft(E) && (Me(E), Jt(E));
      }
    zt && Vn(l), p(Q.afterSanitizeShadowDOM, l, null);
  }, Me = function(l) {
    const y = [{
      node: l,
      shadow: null
    }];
    for (; y.length > 0; ) {
      const M = y.pop();
      if (M.shadow) {
        Jt(M.shadow);
        continue;
      }
      const E = M.node, L = D(E) === nt.element, N = m(E);
      if (N) for (let z = N.length - 1; z >= 0; --z) y.push({
        node: N[z],
        shadow: null
      });
      if (L) {
        const z = P ? P(E) : null;
        if (typeof z == "string" && et(z) === "template") {
          const it = E.content;
          Ft(it) && y.push({
            node: it,
            shadow: null
          });
        }
      }
      if (L) {
        const z = w(E);
        Ft(z) && y.push({
          node: null,
          shadow: z
        }, {
          node: z,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(R) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = null, M = null, E = null, L = null;
    if (ZA = !R, ZA && (R = "<!-->"), typeof R != "string" && !Ge(R) && (R = El(R), typeof R != "string"))
      throw ce("dirty is not a string, aborting");
    if (!t.isSupported) return R;
    LA ? (K = eA, H = Oe) : FA(l), (Q.uponSanitizeElement.length > 0 || Q.uponSanitizeAttribute.length > 0) && (K = Bt(K)), Q.uponSanitizeAttribute.length > 0 && (H = Bt(H)), t.removed = [];
    const N = XA && typeof R != "string" && Ge(R);
    let z = [];
    const it = Ht;
    if (N) {
      zi(R);
      const St = B(R);
      if (typeof St == "string") {
        const oA = et(St);
        if (!K[oA] || ye[oA])
          throw VA(R), ce("root node is forbidden and cannot be sanitized in-place");
      }
      if (gA(R))
        throw VA(R), ce("root node is clobbered and cannot be sanitized in-place");
      z = HA(R), Ht = gr();
    } else if (Ge(R))
      y = _n("<!---->"), M = y.ownerDocument.importNode(R, !0), M.nodeType === nt.element && M.nodeName === "BODY" || M.nodeName === "HTML" ? y = M : y.appendChild(M), Me(y);
    else {
      if (!Lt && !zt && !re && R.indexOf("<") === -1) return k && se ? tt(R) : R;
      if (y = _n(R), !y) return Lt ? null : se ? G : "";
    }
    y && kA && Yt(y.firstChild);
    const qt = N ? R : y;
    try {
      N && Me(R);
      const St = sA(qt);
      for (; E = St.nextNode(); )
        lt(E, qt), JA(E, qt), Ft(E.content) && Jt(E.content);
      N && YA(R, z);
    } catch (St) {
      throw N && (VA(R), QA(R, z)), St;
    } finally {
      Ht = it;
    }
    if (N) {
      if (QA(R, z)) throw ce("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return zt && KA(R), R;
    }
    if (Lt) {
      if (zt && KA(y), we)
        for (L = Si.call(y.ownerDocument); y.firstChild; ) L.appendChild(y.firstChild);
      else L = y;
      return (H.shadowroot || H.shadowrootmode) && (L = Pi.call(n, L, !0)), L;
    }
    let wt = re ? y.outerHTML : y.innerHTML;
    return re && K["!doctype"] && y.ownerDocument && y.ownerDocument.doctype && y.ownerDocument.doctype.name && ot(Nl, y.ownerDocument.doctype.name) && (wt = "<!DOCTYPE " + y.ownerDocument.doctype.name + `>
` + wt), zt && (wt = Ne(wt)), k && se ? tt(wt) : wt;
  }, t.setConfig = function() {
    let R = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    FA(R), LA = !0, eA = K, Oe = H;
  }, t.clearConfig = function() {
    be = null, LA = !1, eA = null, Oe = null, k = U, G = "";
  }, t.isValidAttribute = function(R, l, y) {
    be || FA({});
    const M = et(R), E = et(l);
    return typeof y == "string" && (Qn(l, y) || !tA && ot(vg, y)) ? !1 : At(M, E, y);
  }, t.addHook = function(R, l) {
    typeof l == "function" && Pt(Q, R) && en(Q[R], l);
  }, t.removeHook = function(R, l) {
    if (Pt(Q, R)) {
      if (l !== void 0) {
        const y = dl(Q[R], l);
        return y === -1 ? void 0 : pl(Q[R], y, 1)[0];
      }
      return Cg(Q[R]);
    }
  }, t.removeHooks = function(R) {
    Pt(Q, R) && (Q[R] = []);
  }, t.removeAllHooks = function() {
    Q = bg();
  }, t;
}
var Ul = Uo();
const Fl = ["b", "strong", "i", "em", "u", "s", "br", "p", "span", "div", "ul", "ol", "li", "a", "img", "small", "sub", "sup", "code", "pre", "table", "thead", "tbody", "tr", "th", "td"], Wl = ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"], _l = { values: ["target", "rel", "width", "height"] }, Vl = ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "link", "meta", "base"], Hl = ["srcdoc", "style", "formaction", "xlink:href"], Ql = { valueAttributes: ["image-url", "image-type", "thumbnail-url", "caption", "material-url", "camera-position", "camera-target", "show-texture"], booleanAttributes: ["fit-to-container", "debug-mode"], urlAttributes: ["image-url", "thumbnail-url", "material-url"], textAttributes: { values: ["caption"] } }, me = {
  tags: Fl,
  attributes: Wl,
  uriSafeAttributes: _l,
  forbidTags: Vl,
  forbidAttributes: Hl,
  slide: Ql
}, Yl = me.tags, Kl = me.attributes, Jl = /^(?:https?|mailto|tel|data):/i, ql = me.uriSafeAttributes.values, $l = me.forbidTags, tu = me.forbidAttributes, eu = /^data:image\/(png|jpeg|gif|webp|avif);/i, Eg = (A) => !!A && /^\s*data:/i.test(A);
function Au(A) {
  if (A.tagName === "A" && A.getAttribute("target") === "_blank" && A.setAttribute("rel", "noopener noreferrer"), A.tagName === "IMG") {
    const e = A.getAttribute("src");
    Eg(e) && !eu.test(e.trim()) && A.removeAttribute("src"), A.hasAttribute("srcset") && A.removeAttribute("srcset");
  } else
    for (const e of ["src", "href", "xlink:href"])
      Eg(A.getAttribute(e)) && A.removeAttribute(e);
}
let sn;
function Fo() {
  if (sn) return sn;
  const A = globalThis.window;
  if (!A)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return sn = Ul(A), sn.addHook("afterSanitizeAttributes", Au), sn;
}
function wu(A) {
  return A == null ? "" : Fo().sanitize(String(A), {
    ALLOWED_TAGS: Yl,
    ALLOWED_ATTR: Kl,
    ALLOWED_URI_REGEXP: Jl,
    ADD_URI_SAFE_ATTR: ql,
    FORBID_TAGS: $l,
    FORBID_ATTR: tu,
    ALLOW_DATA_ATTR: !1,
    // 禁止タグを落としても中身のテキストは残す（実データの可読性を保つ）
    KEEP_CONTENT: !0
  });
}
function nu(A) {
  return A == null ? "" : String(A).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function iu(A) {
  if (A == null) return "";
  const t = Fo().sanitize(String(A), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: !0
  }), e = globalThis.window.document.createElement("div");
  return e.innerHTML = t, e.textContent || "";
}
const ru = new Set(me.slide.valueAttributes), su = new Set(me.slide.booleanAttributes), gu = new Set(me.slide.textAttributes.values), ou = new Set(me.slide.urlAttributes), au = (A) => /^(?:https?:)?\/\/|^\/|^[^:]*$/i.test(A.trim()), Iu = /["'`<>\s]/;
function vu(A) {
  const t = [];
  for (const [e, n] of Object.entries(A || {})) {
    const i = String(e).toLowerCase();
    if (su.has(i)) {
      n && t.push(i);
      continue;
    }
    if (!ru.has(i) || n == null) continue;
    let r = String(n);
    ou.has(i) && (!au(r) || Iu.test(r)) || (gu.has(i) && (r = iu(r)), t.push(`${i}="${nu(r)}"`));
  }
  return t.join(" ");
}
const Cu = {
  osm: xo,
  gsi: Do,
  gsi_ortho: Bo,
  redcircle: ko,
  defaultpin_selected: No,
  defaultpin: es,
  bluedot: fo,
  bluedot_transparent: mo,
  bluedot_small: po
}, cu = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class lu extends de {
  detail;
  constructor(t) {
    super("gps_error"), this.detail = t;
  }
}
class gn extends de {
  detail;
  constructor(t) {
    super("gps_result"), this.detail = t;
  }
}
class uu extends de {
  constructor() {
    super("gps_request");
  }
}
function fA(A, t) {
  console.warn(
    `MaplatCore: POI layer "${A}" not found (${t}). Pass namespaceID (e.g. "<mapID>#<layerId>" for map-derived layers), not the layer-local id.`
  );
}
class pi extends Qg {
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
  __backMapErrorWarned = !1;
  __selectedMarker;
  // oct26-m2-t1: 可視化時の自己修復（issue #101）で使うリソース参照。
  __resizeObserver = null;
  __visibilityHandler = () => {
    this.__applyInitialViewpoint(), this.__schedulePendingView();
  };
  // oct26-m2-t1-ff: 非表示中の changeMap で保留した視点確定と、その適用の予約状態。
  __pendingView = null;
  __pendingViewScheduled = !1;
  uiHooks;
  lifecycleHookResults = {};
  __init = !0;
  __redrawMarkerBlock = !1;
  __redrawMarkerThrottle = [];
  __transparency;
  // nov26-m4-t5: 線・面の登録簿と連番。Object.create(MaplatApp.prototype) の殻でも
  // 動くよう初期化子に頼らず遅延で作る（__vectorStore・連番は undefined を 0 とみなす）。
  __vectors;
  __vectorSeq;
  __vectorDrawSeq;
  lastClickEvent;
  // Maplat App Class
  constructor(t) {
    super(), t = Ae(t), this.appid = t.appid || "sample";
    const e = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    e && t.mapboxToken && (e.accessToken = t.mapboxToken), t.googleApiKey && (this.googleApiKey = t.googleApiKey), this.mapDiv = t.div || "map_div", this.mapDivDocument = document.querySelector(`#${this.mapDiv}`), this.mapDivDocument.classList.add("maplat"), this.logger = new Ko(
      t.debug ? In.ALL : In.INFO
    ), this.enableCache = t.enableCache || !1, this.icon = t.icon, this.selectedIcon = t.selectedIcon, this.translateUI = t.translateUI, this.uiHooks = t.uiHooks;
    const n = t.setting;
    if (t.restore)
      t.restoreSession && (this.restoreSession = !0), this.initialRestore = t.restore;
    else if (t.restoreSession) {
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
    [...$A(`<img id="center_circle" class="prevent-default" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${ko}">`)].reverse().forEach((o) => {
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
      o.addEventListener("touchstart", (g) => {
        g.preventDefault();
      });
    }), this.overlay = "overlay" in t ? t.overlay : !0, this.overlay && this.mapDivDocument.classList.add("with-opacity"), this.waitReady = (async () => {
      const o = await this.settingLoader(n);
      return this.handleSetting(o, t);
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
    const n = this.buildLifecycleContext(t, e), i = cu[t], r = this.uiHooks?.[i];
    if (r)
      try {
        const s = await r(n);
        this.lifecycleHookResults[t] = s, n.uiHookResult = s, n.uiHookResults = { ...this.lifecycleHookResults };
      } catch (s) {
        throw this.logger?.debug?.(`lifecycle:error:${t}`), this.dispatchEvent(new ht("lifecycle:error", { phaseId: t, error: s })), s;
      }
    return this.dispatchEvent(
      new ht(`lifecycle:${t}`, n)
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
      n.push(il(r, i));
    }), Promise.all(n);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(t, e) {
    await this.runLifecyclePhase("setting-loaded", t), this.appData = Ae(t), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const n = await this.prepareMap(e);
    await this.runLifecyclePhase("ui-dom-ready");
    const i = await Lg(this.appData.pois || [], this);
    await this.handlePois(i, n), this.initGeolocation(e);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(t) {
    this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const e = this.geolocation = new Il({
      timerBase: t.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (e.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (e.setTracking(!1), this.gpsEnabled_ = !1), e.on("change", () => {
      (async () => {
        const n = this.mapObject, i = n.getLayer("overlay").getLayers().item(0), r = n.getLayers().item(0), s = i ? i.getSource() : r.getSource(), o = e.getPosition(), g = e.getAccuracy();
        if (!o || !g) return;
        let a = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (a = !this.initialGpsMove_);
        const C = await s.setGPSMarkerAsync({ lnglat: o, acc: g }, a);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, C || (this.alwaysGpsOn || this.handleGPS(!1, !0), s.setGPSMarker());
        const I = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new gn(C ? { lnglat: o, acc: g } : { error: I }));
      })();
    }), e.on("error", (n) => {
      const i = n.code;
      if (i === 3) return;
      e.setTracking(!1), this.gpsEnabled_ = !1;
      const r = this.mapObject, s = r.getLayer("overlay").getLayers().item(0), o = r.getLayers().item(0);
      (s ? s.getSource() : o.getSource()).setGPSMarker(), this.dispatchEvent(new lu(i === 1 ? "user_gps_deny" : i === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new gn({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (e.getTracking()) {
          const n = this.mapObject, i = n.getLayer("overlay").getLayers().item(0), r = n.getLayers().item(0), s = i ? i.getSource() : r.getSource(), o = e.getPosition(), g = e.getAccuracy();
          if (!o || !g) return;
          const a = await s.setGPSMarkerAsync({ lnglat: o, acc: g }, !0);
          a || (this.alwaysGpsOn || this.handleGPS(!1, !0), s.setGPSMarker());
          const C = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new gn(a ? { lnglat: o, acc: g } : { error: C }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(t, e = !1) {
    if (this.geolocation) {
      if (t)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new uu());
        else {
          const n = this.geolocation.getPosition(), i = this.geolocation.getAccuracy();
          if (n && i) {
            const r = this.mapObject, s = r.getLayer("overlay").getLayers().item(0), o = r.getLayers().item(0), g = s ? s.getSource() : o.getSource();
            (async () => await g.setGPSMarkerAsync({ lnglat: n, acc: i }, !1) || (g.setGPSMarker(), this.dispatchEvent(new gn({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const n = this.mapObject, i = n.getLayer("overlay").getLayers().item(0), r = n.getLayers().item(0);
        (i ? i.getSource() : r.getSource()).setGPSMarker(), e || this.dispatchEvent(new gn({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(t) {
    t = Ae(t), this.mercBuffer = null;
    const e = this.appData.homePosition, n = this.appData.defaultZoom, i = this.appData.zoomRestriction, r = this.appData.minZoom, s = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const o = t.fake ? this.appData.fakeGps : !1, g = t.fake ? this.appData.fakeRadius : !1;
    this.noRotate = t.noRotate ?? this.appData.noRotate ?? !1, this.poiTemplate = t.poiTemplate ?? this.appData.poiTemplate ?? !1, this.poiStyle = t.poiStyle ?? this.appData.poiStyle ?? !1, this.iconTemplate = t.iconTemplate ?? this.appData.iconTemplate ?? !1, this.currentPosition = null, this.__init = !0;
    const a = `${this.mapDiv}_front`;
    let C = $A(
      `<div id="${a}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(C, this.mapDivDocument.firstChild), this.fakeGps = o, this.fakeRadius = g, this.homePosition = e, this.mapObject = new De({
      div: a,
      controls: this.appData.controls || [],
      interactions: this.noRotate ? $s({ altShiftDragRotate: !1, pinchRotate: !1 }) : $s().extend([
        new Oc({
          condition: uc
        })
      ]),
      fakeGps: o,
      fakeRadius: g,
      homePosition: e,
      northUp: t.northUp ?? this.appData.northUp ?? !1,
      tapDuration: t.tapDuration ?? this.appData.tapDuration ?? 3e3,
      homeMarginPixels: t.homeMarginPixels ?? this.appData.homeMarginPixels ?? 50,
      tapUIVanish: t.tapUIVanish ?? this.appData.tapUIVanish ?? !1,
      alwaysGpsOn: t.alwaysGpsOn || !1
    });
    let I;
    this.overlay && (I = `${this.mapDiv}_back`, C = $A(
      `<div id="${I}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      C,
      this.mapDivDocument.firstChild
    ), this.backMap = new De({
      off_control: !0,
      div: I
    }));
    const c = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (c) {
      const d = `${this.mapDiv}_mapbox`;
      C = $A(
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
        touchZoomRotate: !1,
        // m6-t9 §3.3: mapbox-gl-js v3 系は既定・状況により Globe 投影になり得るため、
        // Maplat は常に平面（Mercator）表示を前提とする本ライブラリの用途上、明示的に固定する
        projection: "mercator"
      });
    }
    this.registerSelfHeal();
    const u = t.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (u) {
      const d = `${this.mapDiv}_maplibre`;
      C = $A(
        `<div id="${d}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        C,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new u.Map({
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
      n.setMap(this.mapObject), Jo(n, {
        mapboxMap: this.mapboxMap,
        maplibreMap: this.maplibreMap,
        warn: (r, ...s) => {
          this.logger?.warn ? this.logger.warn(r, ...s) : console.warn(r, ...s);
        }
      }) && (e.push(n), this.cacheHash[n.mapID] = n);
    }), this.mercSrc = e.reduce((n, i) => {
      if (n) return n;
      if (i.isBasemap()) return i;
    }, null), this.dispatchEvent(new ht("sourceLoaded", t)), e.length === 0) {
      this.logger?.warn ? this.logger.warn("No usable sources; skipping map initialization handlers") : console.warn("No usable sources; skipping map initialization handlers"), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
      return;
    }
    await this.setInitialMap(e), this.setMapClick(), this.setPointerEvents(), this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(t) {
    const e = this.initialRestore.mapID || this.startFrom || t[t.length - 1].mapID;
    this.from = t.reduce(
      (n, i) => n ? !(n instanceof Ro) && i.mapID != e ? i : n : i.mapID != e ? i : n,
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
        this.dispatchEvent(new ht("clickMarker", e[0])), this.dispatchEvent(new ht("clickMarkers", e));
      else {
        const n = t.coordinate;
        this.dispatchEvent(new ht("clickMapXy", n)), this.from.sysCoord2MercAsync(n).then((i) => {
          this.dispatchEvent(new ht("clickMapMerc", i));
          const r = Ot(i, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new ht("clickMap", {
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
      this.dispatchEvent(new ht("pointerMoveOnMapXy", s)), this.from.sysCoord2MercAsync(s).then((o) => {
        if (this.dispatchEvent(new ht("pointerMoveOnMapMerc", o)), t) {
          const g = t;
          t = !1, r(g);
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
        const o = n.target.forEachFeatureAtPixel(
          n.pixel,
          (g) => {
            if (g.get("datum")) return g;
          }
        );
        this.mapDivDocument.querySelector(`#${s}`).style.cursor = o ? "pointer" : "";
        return;
      }
      this.mapDivDocument.querySelector(`#${s}`).style.cursor = "";
    };
    this.mapObject.on("pointermove", t);
    const e = (n) => {
      if (this.__pendingView) return;
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
      if (!this.backMap || this.__pendingView) return;
      if (this.__backMapMoving) {
        this.logger.debug("Backmap moving skipped");
        return;
      }
      const n = this.backMap.getSource();
      if (n) {
        this.__backMapMoving = !0, this.logger.debug("Backmap moving started");
        const i = (r) => {
          this.__backMapMoving = !1, this.__reportBackMapError(r);
        };
        this.__convertFromCurrent(n, (r) => {
          if (!r) {
            this.__backMapMoving = !1;
            return;
          }
          const s = this.backMap.getView();
          s.setCenter(r[0]), s.setZoom(r[1]), s.setRotation(this.noRotate ? 0 : r[2]), this.logger.debug("Backmap moving ended"), this.__backMapMoving = !1;
        }, i);
      }
    };
    this.mapObject.on("postrender", t);
  }
  // nov26-m4-t1（#108）: 変換が恒常的に失敗する地図では postrender ごとに失敗するので、
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
      const e = this.mapObject.getView(), n = e.getCenter(), i = e.getDecimalZoom(), r = ti(e.getRotation() * 180 / Math.PI), s = await this.from.viewpoint2MercsAsync(), o = await this.mercSrc.mercs2ViewpointAsync(s);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == o[0][0] && this.mobileMapMoveBuffer[0][1] == o[0][1] && this.mobileMapMoveBuffer[1] == o[1] && this.mobileMapMoveBuffer[2] == o[2]) return;
      this.mobileMapMoveBuffer = o;
      const g = Ot(o[0], "EPSG:3857", "EPSG:4326"), a = ti(o[2] * 180 / Math.PI);
      this.dispatchEvent(
        new ht("changeViewpoint", {
          x: n[0],
          y: n[1],
          longitude: g[0],
          latitude: g[1],
          mercator_x: o[0][0],
          mercator_y: o[0][1],
          zoom: i,
          mercZoom: o[1],
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
    return t ? ti(t.getRotation() * 180 / Math.PI) : 0;
  }
  // 現在の実世界方位角を度数で返す。TIN地図では歪み補正込みの非同期計算になるためPromiseを返す (#61)
  async getDirection() {
    if (!this.from || !this.mercSrc) return this.getRotation();
    const t = await this.from.viewpoint2MercsAsync(), e = await this.mercSrc.mercs2ViewpointAsync(t);
    return ti(e[2] * 180 / Math.PI);
  }
  currentMapInfo() {
    return Ss(this.from);
  }
  mapInfo(t) {
    return Ss(this.cacheHash[t]);
  }
  async clientPointToLngLat(t, e) {
    if (!this.from || !this.mapObject) return;
    const i = this.mapObject.getViewport().getBoundingClientRect(), r = [t - i.left, e - i.top], s = this.mapObject.getCoordinateFromPixel(r);
    if (!s) return;
    const o = await this.from.sysCoord2MercAsync(s), g = Ot(o, "EPSG:3857", "EPSG:4326");
    return {
      longitude: g[0],
      latitude: g[1]
    };
  }
  async lngLatToClientPoint(t, e) {
    if (!this.from || !this.mapObject) return;
    const n = Ot([t, e], "EPSG:4326", "EPSG:3857"), i = await this.from.merc2SysCoordAsync(n), r = this.mapObject.getPixelFromCoordinate(i);
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
    ], n = t.x, i = t.y, r = t.coordinates, s = this.from, o = t.icon ? this.__selectedMarker == t.namespaceID && t.selectedIcon ? t.selectedIcon : t.icon : this.__selectedMarker == t.namespaceID ? No : es;
    return (r ? (function() {
      return s.merc2SysCoordAsync_ignoreBackground(
        r
      );
    })() : n && i ? new Promise((a) => {
      a(s.xy2SysCoord([n, i]));
    }) : (function() {
      const a = Ot(e, "EPSG:4326", "EPSG:3857");
      return s.merc2SysCoordAsync_ignoreBackground(
        a
      );
    })()).then((a) => {
      a && s.insideCheckSysCoord(a) && this.mapObject.setMarker(a, { datum: t }, o);
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
    this.__projectVector(t).then((e) => {
      this.mapObject.setVector(e, t.type, t.style);
    });
  }
  // nov26-m4-t5: data の座標（coordinates はメルカトル・lnglats は経緯度）を今の地図の座標へ変換する
  __projectVector(t) {
    this.logger.debug(t);
    let e;
    const n = (i, r = !1) => Promise.all(
      i.map((s) => Array.isArray(s[0]) ? n(s, r) : (r && (s = Ot(s, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(s)))
    );
    return t.coordinates ? e = n(t.coordinates) : e = n(t.lnglats, !0), e;
  }
  __vectorStore() {
    return this.__vectors || (this.__vectors = /* @__PURE__ */ new Map()), this.__vectors;
  }
  __nextVectorDrawToken() {
    return this.__vectorDrawSeq = (this.__vectorDrawSeq || 0) + 1, this.__vectorDrawSeq;
  }
  // nov26-m4-t5: 登録簿の 1 件を描く。変換の解決までに消された・置き換えられた・
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
    let i;
    if (t != null)
      i = String(t);
    else
      do
        this.__vectorSeq = (this.__vectorSeq || 0) + 1, i = `vector_${this.__vectorSeq}`;
      while (n.has(i));
    n.has(i) && this.removeVector(i);
    const r = {
      id: i,
      data: e,
      kind: e.type === void 0 || e.type === "Line" ? "Line" : "Polygon",
      drawToken: 0
    };
    return n.set(i, r), this.__drawVectorEntry(r), i;
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
      const i = [];
      this.resetMarker();
      let r;
      if (!this.stateBuffer.hideMarker) {
        for (const o of Object.keys(this.pois)) {
          const g = this.pois[o];
          if (!g.hide)
            for (const a of g.pois) {
              const C = gg(a, g, this);
              og(C, g, this), this.__selectedMarker == C.namespaceID ? r = C : i.push(this.setMarker(C));
            }
        }
        if (n.pois)
          for (const o of Object.keys(n.pois)) {
            const g = n.pois[o];
            if (!g.hide)
              for (const a of g.pois) {
                const C = gg(a, g, n, this);
                og(C, g, n, this), this.__selectedMarker == C.namespaceID ? r = C : i.push(this.setMarker(C));
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
      if (e = cn(e || {}), n) {
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
      return this.pois[e].pois.push(cn(t)), jr(this.pois, e, {
        name: this.appName
      }), this.dispatchPoiNumber(), this.redrawMarkers(), t.namespaceID;
  }
  removeMarker(t) {
    if (t.includes("#")) {
      const e = t.split("#"), n = this.cacheHash[e[0]];
      n && (n.removePoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      let e = 0;
      for (const n of Object.keys(this.pois)) {
        const i = this.pois[n].pois;
        for (let r = i.length - 1; r >= 0; r--)
          i[r].id === t && (i.splice(r, 1), e++);
      }
      e > 0 && (this.dispatchPoiNumber(), this.redrawMarkers());
    }
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
      new ht(
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
      fA(t, "showPoiLayer");
      return;
    }
    delete e.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  hidePoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      fA(t, "hidePoiLayer");
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
        this.pois[t] = Pe(e || [], t, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const n = t.split("#"), i = this.cacheHash[n[0]];
        i ? (i.addPoiLayer(n[1], e), this.redrawMarkers()) : fA(t, "addPoiLayer");
      }
  }
  removePoiLayer(t) {
    if (t !== "main")
      if (t.includes("#")) {
        const e = t.split("#"), n = this.cacheHash[e[0]];
        if (!n) {
          fA(t, "removePoiLayer");
          return;
        }
        if (!n.getPoiLayer(e[1])) {
          fA(t, "removePoiLayer");
          return;
        }
        n.removePoiLayer(e[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      } else {
        if (!this.pois[t]) {
          fA(t, "removePoiLayer");
          return;
        }
        delete this.pois[t], this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((e) => e.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      }
  }
  // nov26-m4-t5（#91）: 線を足して id を返す。data.id を与えればその id、無ければ自動の id。
  // 呼び手の data は変えず、写しに setLine と同じ正規化（type・stroke → style）をする。
  addLine(t) {
    const e = { ...t, type: "Line" };
    return !e.style && e.stroke && (e.style = {
      stroke: e.stroke
    }), delete e.id, this.__addEntry(t.id, e);
  }
  // nov26-m4-t5（#91）: 線・面を足して id を返す（data.type が "Line" なら線、それ以外は面）
  addVector(t) {
    const e = { ...t };
    return delete e.id, this.__addEntry(t.id, e);
  }
  // nov26-m4-t5（#91）: id の 1 件だけを消す。消したら true、無ければ false
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
    const n = this.mercSrc, i = this.cacheHash[t];
    return i ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((r, s) => {
        const o = () => this.convertParametersFromCurrent(i, (g) => {
          const a = this.from, C = this.__captureViewState();
          let I = null, c = null;
          const u = e.backgroundID ? this.cacheHash[e.backgroundID] : void 0;
          if (this.backMap && (I = this.backMap.getSource(), i.isWmts() ? this.backMap.exchangeSource() : (u ? (c = u, this.backMap.exchangeSource(c)) : I ? c = I : (c = n, this.from.isWmts() && (c = this.from instanceof di ? (
            // If current foreground is a TMS overlay, use the current
            // basemap as new background. On initial load no foreground
            // source is set yet, so fall back to the default basemap
            // (mercSrc) to avoid a null background source.
            this.mapObject.getSource() || n
          ) : this.from), c && this.backMap.exchangeSource(c)), c && this.requestUpdateState({ backgroundID: c.mapID }))), i instanceof di) {
            if (this.mapObject.setLayer(i), u)
              this.mapObject.exchangeSource(u);
            else if (!this.from.isWmts()) {
              const h = I || n;
              this.mapObject.exchangeSource(h);
            }
            const m = this.mapObject.getSource();
            m && this.requestUpdateState({ backgroundID: m.mapID });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(i);
          const d = {
            mapID: i.mapID
          };
          i.isBasemap() && (d.backgroundID = "____delete____"), this.requestUpdateState(d), this.from = i, this.dispatchPoiNumber();
          const f = this.mapObject.getView();
          this.appData.zoomRestriction && (f.setMaxZoom(i.maxZoom), f.setMinZoom(i.minZoom || 0)), g && i.insideCheckSysCoord(g[0]) ? (f.setCenter(g[0]), f.setZoom(g[1]), f.setRotation(this.noRotate ? 0 : g[2])) : !this.__init && !g && !this.__hasMapSize() && a ? this.__pendingView ? this.__pendingView.positionMapID !== i.mapID && (delete this.__pendingView.position, delete this.__pendingView.positionMapID) : this.__pendingView = { from: a, state: C } : this.__init ? g || this.__hasMapSize() && this.goHome(i) : (this.dispatchEvent(new ht("outOfMap", {})), this.goHome(i)), i.setGPSMarker(this.currentPosition, !0), e.hideLayer && (e.hideLayer.split(",").map((h) => {
            const w = this.getPoiLayer(h);
            w && (w.hide = !0);
          }), this.requestUpdateState({ hideLayer: e.hideLayer })), e.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.__vectorStore().forEach((m) => this.__drawVectorEntry(m)), this.dispatchEvent(
            new ht("mapChanged", this.getMapMeta(i.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), e.position && (this.__hasMapSize() ? (this.__init = !1, i.setViewpoint(e.position)) : this.__pendingView && (this.__pendingView.position = e.position, this.__pendingView.positionMapID = i.mapID)), this.setTransparency(
            e.transparency !== void 0 && e.transparency !== null ? e.transparency : this.getTransparency()
          ), this.__init ? this.__hasMapSize() && (this.__init = !1, this.goHome(i)) : this.backMap && c && this.convertParametersFromCurrent(c, (m) => {
            if (!m)
              return;
            const h = this.backMap.getView();
            h.setCenter(m[0]), h.setZoom(m[1]), h.setRotation(this.noRotate ? 0 : m[2]), this.backMap.updateSize(), this.backMap.render();
          }), r(void 0);
        });
        this.__pendingView ? this.__applyPendingView().then(o) : o();
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
      this.timer = void 0, this.dispatchEvent(new ht("updateState", this.stateBuffer));
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
  // oct26-m2-t1: 可視化時の自己修復ハンドラの登録（issue #101）。
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
  // oct26-m2-t1: 初期視点が未適用（__init）かつコンテナ寸法が有効なときに、初期視点
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
  // oct26-m2-t1-ff: 保留した視点確定の適用を changeMapSeq の後ろに予約する。
  // 寸法が無ければ予約しない。ResizeObserver・visibilitychange・postrender が
  // 続けて来ても、適用が走るまでは 1 回だけ予約する。
  __schedulePendingView() {
    if (!this.__pendingView || this.__pendingViewScheduled) return;
    const t = this.mapObject;
    t && (t.updateSize(), this.__hasMapSize() && (this.__pendingViewScheduled = !0, this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(() => (this.__pendingViewScheduled = !1, this.__applyPendingView()))));
  }
  // oct26-m2-t1-ff: 保留した視点確定を、表示中の changeMap と同じ規則で適用する。
  // 切替前の地図と視点を変換核 __convertParameters に通し（mercBuffer を含む同じ変換）、
  // 範囲内なら setCenter/setZoom/setRotation、範囲外なら outOfMap + goHome。
  // 保留に position があり行き先が一致すれば、変換の後で setViewpoint で上書きする。
  // 締めは m2-t1 の __applyInitialViewpoint と同じ updateSize + render。
  __applyPendingView() {
    const t = this.__pendingView, e = this.mapObject, n = this.from;
    return !t || !e || !n || (e.updateSize(), !this.__hasMapSize()) ? Promise.resolve() : new Promise((i) => {
      let r = !1;
      const s = () => {
        r || (r = !0, this.__pendingView === t && (this.__pendingView = null), t.position && t.positionMapID === n.mapID && n.setViewpoint(t.position), e.updateSize(), e.render(), i());
      }, o = (g) => {
        r || (this.logger.warn(`changeMap: pending viewpoint conversion failed: ${g}`), this.goHome(n), s());
      };
      if (!t.state) {
        this.goHome(n), s();
        return;
      }
      try {
        this.__convertParameters(
          t.from,
          t.state,
          n,
          (g) => {
            const a = e.getView();
            g && n.insideCheckSysCoord(g[0]) ? (a.setCenter(g[0]), a.setZoom(g[1]), a.setRotation(this.noRotate ? 0 : g[2])) : (this.dispatchEvent(new ht("outOfMap", {})), this.goHome(n)), s();
          },
          o
        );
      } catch (g) {
        o(g);
      }
    });
  }
  // oct26-m2-t1-ff: 現在の view の視点を控える。有限でない値を含む場合は undefined
  // （非表示中に resolution が NaN へ崩れた後など。変換核へ流すと #101 と同じ例外になる）。
  __captureViewState() {
    const t = this.mapObject ? this.mapObject.getView() : void 0;
    if (!t) return;
    const e = this.__captureRawViewState(t), { center: n, zoom: i, decimalZoom: r, rotation: s } = e;
    if (!(!n || ![n[0], n[1], i, r, s].every(
      (o) => Number.isFinite(o)
    )))
      return { center: [n[0], n[1]], zoom: i, decimalZoom: r, rotation: s };
  }
  // oct26-m2-t1-ff: view の値を検査せずにそのまま読む（切り出し前の
  // convertParametersFromCurrent が変換の直前に読んでいた値と同じ）。
  __captureRawViewState(t) {
    return {
      center: t.getCenter(),
      zoom: t.getZoom(),
      decimalZoom: t.getDecimalZoom(),
      rotation: t.getRotation()
    };
  }
  // oct26-m2-t1: コンテナ寸法が有効（map size が正）かどうか。非表示コンテナ
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
    if (t ? e = this.cacheHash[t] : e = this.from, !!e)
      return un.reduce(
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
    this.__convertFromCurrent(t, e);
  }
  // nov26-m4-t1（#108）: convertParametersFromCurrent の本体。公開の型を変えずに
  // onError の口を得るために private へ移した。onError を渡したときだけ、同期例外も
  // 非同期の失敗（__convertParameters の onError）も投げずに onError へ渡す。
  // onError が無いときは今までと同じ（例外をそのまま投げる）。
  __convertFromCurrent(t, e, n) {
    try {
      const i = this.mapObject.getView();
      if (i && !this.__hasMapSize()) {
        e && e();
        return;
      }
      if (!this.from) {
        e && e();
        return;
      }
      const r = this.__captureRawViewState(i);
      this.__convertParameters(
        this.from,
        r,
        t,
        e,
        n
      );
    } catch (i) {
      if (n) n(i);
      else throw i;
    }
  }
  // oct26-m2-t1-ff: 変換核。切替前の地図 fromSrc と、そのときの視点 state（地図の
  // 座標系の値）から、行き先 to の視点を求めて callback(size) を呼ぶ。中身は切り出し前の
  // convertParametersFromCurrent と同じ（mercBuffer のキャッシュ判定・
  // viewpoint2MercsAsync・mercs2ViewpointAsync・mercBuffer の更新）。
  // viewpoint2MercsAsync へは省略時に内部で読む値（center・getDecimalZoom・rotation）を
  // 明示で渡す。onError を渡した場合だけ、変換の失敗を投げずに onError へ渡す。
  __convertParameters(t, e, n, i, r) {
    let s = t.viewpoint2MercsAsync([
      e.center,
      e.decimalZoom,
      e.rotation
    ]);
    const o = Or(
      [e.center, e.zoom, e.rotation],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[t.mapID]) {
      const g = this.mercBuffer.buffer[t.mapID];
      g[0][0] == o[0][0] && g[0][1] == o[0][1] && g[1] == o[1] && g[2] == o[2] ? (this.logger.debug(g), this.logger.debug(o), this.logger.debug("From: Use buffer"), s = new Promise((a, C) => {
        a(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[t.mapID] = o);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[t.mapID] = o;
    this.logger.debug(
      `From: Center: ${o[0]} Zoom: ${o[1]} Rotation: ${o[2]}`
    ), this.logger.debug(`From: ${t.mapID}`), s.then((g) => {
      this.mercBuffer.mercs = g, this.logger.debug(`Mercs: ${g}`);
      let a = n.mercs2ViewpointAsync(g);
      const C = n.mapID;
      this.mercBuffer.buffer[C] && (this.logger.debug("To: Use buffer"), a = new Promise((I, c) => {
        I(this.mercBuffer.buffer[C]);
      })), a.then((I) => {
        this.logger.debug(
          `To: Center: ${I[0]} Zoom: ${I[1]} Rotation: ${I[2]}`
        ), this.logger.debug(`To: ${n.mapID}`), this.mercBuffer.buffer[n.mapID] = Or(I, 10), i(I);
      }).catch((I) => {
        if (r) r(I);
        else throw I;
      });
    }).catch((g) => {
      if (r) r(g);
      else throw g;
    });
  }
  remove() {
    typeof document < "u" && document.removeEventListener("visibilitychange", this.__visibilityHandler), this.__resizeObserver && (this.__resizeObserver.disconnect(), this.__resizeObserver = null), this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
pi.createObject = function(A) {
  return new Promise((t) => {
    const e = new pi(A);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const A = {
    createObject: pi.createObject
  };
  window.Maplat = A, window.MaplatApp = pi, window.assets = Cu;
}
export {
  ht as CustomEvent,
  lu as GPSErrorEvent,
  uu as GPSRequestEvent,
  gn as GPSResultEvent,
  pi as MaplatApp,
  De as MaplatMap,
  Cu as assets,
  vu as buildSlideAttrs,
  $A as createElement,
  nu as escapeAttr,
  il as mapSourceFactory,
  wu as sanitizeHtml,
  iu as toPlainText
};
//# sourceMappingURL=maplat_core.js.map
