function ma(t) {
  t("EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"), t("EPSG:4269", "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"), t("EPSG:3857", "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
  for (var i = 1; i <= 60; ++i)
    t("EPSG:" + (32600 + i), "+proj=utm +zone=" + i + " +datum=WGS84 +units=m"), t("EPSG:" + (32700 + i), "+proj=utm +zone=" + i + " +south +datum=WGS84 +units=m");
  t("EPSG:5041", "+title=WGS 84 / UPS North (E,N) +proj=stere +lat_0=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"), t("EPSG:5042", "+title=WGS 84 / UPS South (E,N) +proj=stere +lat_0=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"), t.WGS84 = t["EPSG:4326"], t["EPSG:3785"] = t["EPSG:3857"], t.GOOGLE = t["EPSG:3857"], t["EPSG:900913"] = t["EPSG:3857"], t["EPSG:102113"] = t["EPSG:3857"];
}
var it = 1, at = 2, ft = 3, ya = 4, ti = 5, yi = 6378137, Ea = 6356752314e-3, Ei = 0.0066943799901413165, yt = 484813681109536e-20, d = Math.PI / 2, Sa = 0.16666666666666666, wa = 0.04722222222222222, Pa = 0.022156084656084655, m = 1e-10, I = 0.017453292519943295, k = 57.29577951308232, b = Math.PI / 4, xt = Math.PI * 2, R = 3.14159265359, F = {};
F.greenwich = 0;
F.lisbon = -9.131906111111;
F.paris = 2.337229166667;
F.bogota = -74.080916666667;
F.madrid = -3.687938888889;
F.rome = 12.452333333333;
F.bern = 7.439583333333;
F.jakarta = 106.807719444444;
F.ferro = -17.666666666667;
F.brussels = 4.367975;
F.stockholm = 18.058277777778;
F.athens = 23.7163375;
F.oslo = 10.722916666667;
const Ga = {
  mm: { to_meter: 1e-3 },
  cm: { to_meter: 0.01 },
  ft: { to_meter: 0.3048 },
  "us-ft": { to_meter: 1200 / 3937 },
  fath: { to_meter: 1.8288 },
  kmi: { to_meter: 1852 },
  "us-ch": { to_meter: 20.1168402336805 },
  "us-mi": { to_meter: 1609.34721869444 },
  km: { to_meter: 1e3 },
  "ind-ft": { to_meter: 0.30479841 },
  "ind-yd": { to_meter: 0.91439523 },
  mi: { to_meter: 1609.344 },
  yd: { to_meter: 0.9144 },
  ch: { to_meter: 20.1168 },
  link: { to_meter: 0.201168 },
  dm: { to_meter: 0.1 },
  in: { to_meter: 0.0254 },
  "ind-ch": { to_meter: 20.11669506 },
  "us-in": { to_meter: 0.025400050800101 },
  "us-yd": { to_meter: 0.914401828803658 }
};
var Si = /[\s_\-\/\(\)]/g;
function X(t, i) {
  if (t[i])
    return t[i];
  for (var a = Object.keys(t), s = i.toLowerCase().replace(Si, ""), e = -1, r, n; ++e < a.length; )
    if (r = a[e], n = r.toLowerCase().replace(Si, ""), n === s)
      return t[r];
}
function ii(t) {
  var i = {}, a = t.split("+").map(function(h) {
    return h.trim();
  }).filter(function(h) {
    return h;
  }).reduce(function(h, o) {
    var l = o.split("=");
    return l.push(!0), h[l[0].toLowerCase()] = l[1], h;
  }, {}), s, e, r, n = {
    proj: function(h) {
      i.projName = ["lonlat", "latlon", "latlong"].includes(h) ? "longlat" : h;
    },
    datum: "datumCode",
    rf: function(h) {
      i.rf = parseFloat(h);
    },
    lat_0: function(h) {
      i.lat0 = h * I;
    },
    lat_1: function(h) {
      i.lat1 = h * I;
    },
    lat_2: function(h) {
      i.lat2 = h * I;
    },
    lat_ts: function(h) {
      i.lat_ts = h * I;
    },
    lon_0: function(h) {
      i.long0 = h * I;
    },
    lon_wrap: function(h) {
      i.long_wrap = parseFloat(h) * I;
    },
    lon_1: function(h) {
      i.long1 = h * I;
    },
    lon_2: function(h) {
      i.long2 = h * I;
    },
    alpha: function(h) {
      i.alpha = parseFloat(h) * I;
    },
    gamma: function(h) {
      i.rectified_grid_angle = parseFloat(h) * I;
    },
    lonc: function(h) {
      i.longc = h * I;
    },
    x_0: function(h) {
      i.x0 = parseFloat(h);
    },
    y_0: function(h) {
      i.y0 = parseFloat(h);
    },
    k_0: function(h) {
      i.k0 = parseFloat(h);
    },
    k: function(h) {
      i.k0 = parseFloat(h);
    },
    a: function(h) {
      i.a = parseFloat(h);
    },
    b: function(h) {
      i.b = parseFloat(h);
    },
    r: function(h) {
      i.a = i.b = parseFloat(h);
    },
    r_a: function() {
      i.R_A = !0;
    },
    zone: function(h) {
      i.zone = parseInt(h, 10);
    },
    south: function() {
      i.utmSouth = !0;
    },
    towgs84: function(h) {
      i.datum_params = h.split(",").map(function(o) {
        return parseFloat(o);
      });
    },
    to_meter: function(h) {
      i.to_meter = parseFloat(h);
    },
    units: function(h) {
      i.units = h;
      var o = X(Ga, h);
      o && (i.to_meter = o.to_meter);
    },
    from_greenwich: function(h) {
      i.from_greenwich = h * I;
    },
    pm: function(h) {
      var o = X(F, h);
      i.from_greenwich = (o || parseFloat(h)) * I;
    },
    nadgrids: function(h) {
      h === "@null" ? i.datumCode = "none" : i.nadgrids = h;
    },
    axis: function(h) {
      var o = "ewnsud";
      h.length === 3 && o.indexOf(h.substr(0, 1)) !== -1 && o.indexOf(h.substr(1, 1)) !== -1 && o.indexOf(h.substr(2, 1)) !== -1 && (i.axis = h);
    },
    approx: function() {
      i.approx = !0;
    },
    over: function() {
      i.over = !0;
    }
  };
  for (s in a)
    e = a[s], s in n ? (r = n[s], typeof r == "function" ? r(e) : i[r] = e) : i[s] = e;
  return typeof i.datumCode == "string" && i.datumCode !== "WGS84" && (i.datumCode = i.datumCode.toLowerCase()), i.projStr = t, i;
}
var xa = 0.017453292519943295;
function ct(t) {
  return t * xa;
}
function $i(t) {
  return /^(equirectangular|equidistant[ _]cylindrical)/i.test(t || "");
}
function zi(t) {
  const i = (t.projName || "").toLowerCase().replace(/_/g, " ");
  t.long0 === void 0 && t.longc !== void 0 && (t.long0 = t.longc), !t.lat_ts && t.lat1 && (i === "stereographic south pole" || i === "polar stereographic (variant b)") ? (t.lat0 = ct(t.lat1 > 0 ? 90 : -90), t.lat_ts = t.lat1, delete t.lat1) : !t.lat_ts && t.lat0 && (i === "polar stereographic" || i === "polar stereographic (variant a)") ? (t.lat_ts = t.lat0, t.lat0 = ct(t.lat0 > 0 ? 90 : -90), delete t.lat1) : t.lat_ts === void 0 && t.lat1 !== void 0 && $i(t.projName) && (t.lat_ts = t.lat1, delete t.lat1);
}
class ba {
  static getId(i) {
    const a = i.find((s) => Array.isArray(s) && s[0] === "ID");
    return a && a.length >= 3 ? {
      authority: a[1],
      code: this.parseCode(a[2])
    } : null;
  }
  // PROJJSON codes are integers, or strings for codes like IGNF:LURESG
  static parseCode(i) {
    return /^-?\d+$/.test(i) ? parseInt(i, 10) : i;
  }
  static convertUnit(i, a = "unit") {
    if (!i || i.length < 3)
      return { type: a, name: "unknown", conversion_factor: null };
    const s = i[1], e = parseFloat(i[2]) || null, r = i.find((h) => Array.isArray(h) && h[0] === "ID"), n = r ? {
      authority: r[1],
      code: this.parseCode(r[2])
    } : null;
    return {
      type: a,
      name: s,
      conversion_factor: e,
      id: n
    };
  }
  static convertAxis(i) {
    const a = i[1] || "Unknown";
    let s;
    const e = a.match(/^\((.)\)$/);
    if (e) {
      const l = e[1].toUpperCase();
      if (l === "E") s = "east";
      else if (l === "N") s = "north";
      else if (l === "U") s = "up";
      else if (i[2]) s = i[2];
      else throw new Error(`Unknown axis abbreviation: ${l}`);
    } else
      s = i[2] || "unknown";
    const r = i.find((l) => Array.isArray(l) && l[0] === "ORDER"), n = r ? parseInt(r[1], 10) : null, h = i.find(
      (l) => Array.isArray(l) && (l[0] === "LENGTHUNIT" || l[0] === "ANGLEUNIT" || l[0] === "SCALEUNIT")
    ), o = this.convertUnit(h);
    return {
      name: a,
      direction: s,
      // Use the valid PROJJSON direction value
      unit: o,
      order: n
    };
  }
  static extractAxes(i) {
    return i.filter((a) => Array.isArray(a) && a[0] === "AXIS").map((a) => this.convertAxis(a)).sort((a, s) => (a.order || 0) - (s.order || 0));
  }
  // A prime meridian without a unit takes the angle unit of its CRS (ISO 19162, 8.2.2).
  // Like PROJ, write the longitude as a number in degrees, or as a value with a unit.
  static convertPrimeMeridianLongitude(i, a) {
    const s = parseFloat(i[2]), e = i.find(
      (n) => Array.isArray(n) && (n[0] === "ANGLEUNIT" || n[0] === "UNIT")
    ) || a, r = this.convertUnit(e, "AngularUnit");
    return !r.conversion_factor || Math.abs(r.conversion_factor / ct(1) - 1) < 1e-9 ? s : { value: s, unit: r };
  }
  static convert(i, a = {}) {
    switch (i[0]) {
      case "PROJCRS":
        a.type = "ProjectedCRS", a.name = i[1];
        const s = i.find(
          (c) => Array.isArray(c) && (c[0] === "BASEGEOGCRS" || c[0] === "BASEGEODCRS")
        );
        a.base_crs = s ? this.convert(s) : null, a.conversion = i.find((c) => Array.isArray(c) && c[0] === "CONVERSION") ? this.convert(i.find((c) => Array.isArray(c) && c[0] === "CONVERSION")) : null;
        const e = i.find((c) => Array.isArray(c) && c[0] === "CS");
        e && (a.coordinate_system = {
          subtype: e[1],
          axis: this.extractAxes(i)
        });
        const r = i.find((c) => Array.isArray(c) && c[0] === "LENGTHUNIT");
        if (r) {
          const c = this.convertUnit(r);
          a.coordinate_system.unit = c;
        }
        a.id = this.getId(i);
        break;
      case "BASEGEOGCRS":
      case "BASEGEODCRS":
      case "GEOGCRS":
      case "GEODCRS":
        a.type = i[0] === "GEODCRS" ? "GeodeticCRS" : "GeographicCRS", a.name = i[1];
        const n = i.find(
          (c) => Array.isArray(c) && (c[0] === "DATUM" || c[0] === "ENSEMBLE")
        );
        if (n) {
          const c = this.convert(n);
          n[0] === "ENSEMBLE" ? a.datum_ensemble = c : a.datum = c;
          const v = i.find((E) => Array.isArray(E) && E[0] === "PRIMEM");
          v && v[1] !== "Greenwich" && (c.prime_meridian = {
            name: v[1],
            longitude: this.convertPrimeMeridianLongitude(
              v,
              i.find((E) => Array.isArray(E) && E[0] === "ANGLEUNIT")
            )
          });
        }
        const h = i.find((c) => Array.isArray(c) && c[0] === "CS");
        a.coordinate_system = {
          subtype: h ? h[1] : "ellipsoidal",
          axis: this.extractAxes(i)
        }, a.id = this.getId(i);
        break;
      case "DATUM":
        a.type = "GeodeticReferenceFrame", a.name = i[1], a.ellipsoid = i.find((c) => Array.isArray(c) && c[0] === "ELLIPSOID") ? this.convert(i.find((c) => Array.isArray(c) && c[0] === "ELLIPSOID")) : null;
        break;
      case "ENSEMBLE":
        a.type = "DatumEnsemble", a.name = i[1], a.members = i.filter((c) => Array.isArray(c) && c[0] === "MEMBER").map((c) => ({
          type: "DatumEnsembleMember",
          name: c[1],
          id: this.getId(c)
          // Extract ID as { authority, code }
        }));
        const o = i.find((c) => Array.isArray(c) && c[0] === "ENSEMBLEACCURACY");
        o && (a.accuracy = parseFloat(o[1]));
        const l = i.find((c) => Array.isArray(c) && c[0] === "ELLIPSOID");
        l && (a.ellipsoid = this.convert(l)), a.id = this.getId(i);
        break;
      case "ELLIPSOID":
        a.type = "Ellipsoid", a.name = i[1], a.semi_major_axis = parseFloat(i[2]), a.inverse_flattening = parseFloat(i[3]);
        const _ = i.find((c) => Array.isArray(c) && c[0] === "LENGTHUNIT");
        _ && this.convert(_, a);
        break;
      case "CONVERSION":
        a.type = "Conversion", a.name = i[1], a.method = i.find((c) => Array.isArray(c) && c[0] === "METHOD") ? this.convert(i.find((c) => Array.isArray(c) && c[0] === "METHOD")) : null, a.parameters = i.filter((c) => Array.isArray(c) && c[0] === "PARAMETER").map((c) => this.convert(c));
        break;
      case "METHOD":
        a.type = "Method", a.name = i[1], a.id = this.getId(i);
        break;
      case "PARAMETER":
        a.type = "Parameter", a.name = i[1], a.value = parseFloat(i[2]), a.unit = this.convertUnit(
          i.find(
            (c) => Array.isArray(c) && (c[0] === "LENGTHUNIT" || c[0] === "ANGLEUNIT" || c[0] === "SCALEUNIT")
          )
        ), a.id = this.getId(i);
        break;
      case "COMPOUNDCRS":
        a.type = "CompoundCRS", a.name = i[1], a.components = i.slice(2).filter((c) => Array.isArray(c) && c[0].endsWith("CRS")).map((c) => this.convert(c)), a.id = this.getId(i);
        break;
      case "BOUNDCRS":
        a.type = "BoundCRS";
        const f = i.find((c) => Array.isArray(c) && c[0] === "SOURCECRS");
        if (f) {
          const c = f.find((v) => Array.isArray(v));
          a.source_crs = c ? this.convert(c) : null;
        }
        const u = i.find((c) => Array.isArray(c) && c[0] === "TARGETCRS");
        if (u) {
          const c = u.find((v) => Array.isArray(v));
          a.target_crs = c ? this.convert(c) : null;
        }
        const g = i.find((c) => Array.isArray(c) && c[0] === "ABRIDGEDTRANSFORMATION");
        g ? a.transformation = this.convert(g) : a.transformation = null;
        break;
      case "ABRIDGEDTRANSFORMATION":
        if (a.type = "Transformation", a.name = i[1], a.method = i.find((c) => Array.isArray(c) && c[0] === "METHOD") ? this.convert(i.find((c) => Array.isArray(c) && c[0] === "METHOD")) : null, a.parameters = i.filter((c) => Array.isArray(c) && (c[0] === "PARAMETER" || c[0] === "PARAMETERFILE")).map((c) => {
          if (c[0] === "PARAMETER")
            return this.convert(c);
          if (c[0] === "PARAMETERFILE")
            return {
              name: c[1],
              value: c[2],
              id: {
                authority: "EPSG",
                code: 8656
              }
            };
        }), a.parameters.length === 7) {
          const c = a.parameters[6];
          c.name === "Scale difference" && !c.unit.conversion_factor && (c.value = Math.round((c.value - 1) * 1e12) / 1e6, c.unit = { type: "ScaleUnit", name: "parts per million", conversion_factor: 1e-6, id: null });
        }
        a.id = this.getId(i);
        break;
      case "AXIS":
        a.coordinate_system || (a.coordinate_system = { type: "unspecified", axis: [] }), a.coordinate_system.axis.push(this.convertAxis(i));
        break;
      case "LENGTHUNIT":
        const M = this.convertUnit(i, "LinearUnit");
        a.coordinate_system && a.coordinate_system.axis && a.coordinate_system.axis.forEach((c) => {
          c.unit || (c.unit = M);
        }), M.conversion_factor && M.conversion_factor !== 1 && a.semi_major_axis && (a.semi_major_axis = {
          value: a.semi_major_axis,
          unit: M
        });
        break;
      default:
        a.keyword = i[0];
        break;
    }
    return a;
  }
}
function Bi(t) {
  t[0] = t[0].toUpperCase();
  for (var i = 1; i < t.length; i++)
    Array.isArray(t[i]) && Bi(t[i]);
}
var Aa = {
  GEODETICCRS: "GEODCRS",
  GEOGRAPHICCRS: "GEOGCRS",
  PROJECTEDCRS: "PROJCRS",
  GEODETICDATUM: "DATUM",
  TRF: "DATUM",
  SPHEROID: "ELLIPSOID",
  PRIMEMERIDIAN: "PRIMEM",
  PROJECTION: "METHOD",
  VERTICALCRS: "VERTCRS",
  VERTICALDATUM: "VDATUM",
  VRF: "VDATUM",
  ENGINEERINGCRS: "ENGCRS",
  ENGINEERINGDATUM: "EDATUM",
  PARAMETRICDATUM: "PDATUM",
  TIMEDATUM: "TDATUM",
  TEMPORALQUANTITY: "TIMEUNIT"
};
function ji(t) {
  t[0] = Aa[t[0]] || t[0];
  for (var i = 1; i < t.length; i++)
    Array.isArray(t[i]) && ji(t[i]);
}
function Na(t) {
  return Bi(t), ji(t), ba.convert(t);
}
function Ia(t) {
  const i = t.toUpperCase();
  return i.includes("PROJCRS") || i.includes("GEOGCRS") || i.includes("BOUNDCRS") || i.includes("VERTCRS") || i.includes("LENGTHUNIT") || i.includes("ANGLEUNIT") || i.includes("SCALEUNIT") ? "WKT2" : (i.includes("PROJCS") || i.includes("GEOGCS") || i.includes("LOCAL_CS") || i.includes("VERT_CS") || i.includes("UNIT"), "WKT1");
}
var bt = 1, Wi = 2, Hi = 3, $t = 4, Qi = 5, oi = -1, Ca = /\s/, Ra = /[A-Za-z]/, Ta = /[A-Za-z84_]/, Kt = /[,\])]/, Ki = /[\d\.Ee\-\+]/;
function Q(t) {
  if (typeof t != "string")
    throw new Error("not a string");
  this.text = t.trim(), this.level = 0, this.place = 0, this.root = null, this.stack = [], this.currentObject = null, this.state = bt;
}
Q.prototype.readCharicter = function() {
  var t = this.text[this.place++];
  if (this.state !== $t)
    for (; Ca.test(t); ) {
      if (this.place >= this.text.length)
        return;
      t = this.text[this.place++];
    }
  switch (this.state) {
    case bt:
      return this.neutral(t);
    case Wi:
      return this.keyword(t);
    case $t:
      return this.quoted(t);
    case Qi:
      return this.afterquote(t);
    case Hi:
      return this.number(t);
    case oi:
      return;
  }
};
Q.prototype.afterquote = function(t) {
  if (t === '"') {
    this.word += '"', this.state = $t;
    return;
  }
  if (Kt.test(t)) {
    this.word = this.word.trim(), this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in afterquote yet, index ' + this.place);
};
Q.prototype.afterItem = function(t) {
  if (t === ",") {
    this.word !== null && this.currentObject.push(this.word), this.word = null, this.state = bt;
    return;
  }
  if (t === "]" || t === ")") {
    this.level--, this.word !== null && (this.currentObject.push(this.word), this.word = null), this.state = bt, this.currentObject = this.stack.pop(), this.currentObject || (this.state = oi);
    return;
  }
};
Q.prototype.number = function(t) {
  if (Ki.test(t)) {
    this.word += t;
    return;
  }
  if (Kt.test(t)) {
    this.word = parseFloat(this.word), this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in number yet, index ' + this.place);
};
Q.prototype.quoted = function(t) {
  if (t === '"') {
    this.state = Qi;
    return;
  }
  this.word += t;
};
Q.prototype.keyword = function(t) {
  if (Ta.test(t)) {
    this.word += t;
    return;
  }
  if (t === "[" || t === "(") {
    var i = [];
    i.push(this.word), this.level++, this.root === null ? this.root = i : this.currentObject.push(i), this.stack.push(this.currentObject), this.currentObject = i, this.state = bt;
    return;
  }
  if (Kt.test(t)) {
    this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in keyword yet, index ' + this.place);
};
Q.prototype.neutral = function(t) {
  if (Ra.test(t)) {
    this.word = t, this.state = Wi;
    return;
  }
  if (t === '"') {
    this.word = "", this.state = $t;
    return;
  }
  if (Ki.test(t)) {
    this.word = t, this.state = Hi;
    return;
  }
  if (Kt.test(t)) {
    this.afterItem(t);
    return;
  }
  throw new Error(`havn't handled "` + t + '" in neutral yet, index ' + this.place);
};
Q.prototype.output = function() {
  for (; this.place < this.text.length; )
    this.readCharicter();
  if (this.state === oi)
    return this.root;
  throw new Error('unable to parse string "' + this.text + '". State is ' + this.state);
};
function pa(t) {
  var i = new Q(t);
  return i.output();
}
function Vt(t, i, a) {
  Array.isArray(i) && (a.unshift(i), i = null);
  var s = i ? {} : t, e = a.reduce(function(r, n) {
    return ht(n, r), r;
  }, s);
  i && (t[i] = e);
}
function ht(t, i) {
  if (!Array.isArray(t)) {
    i[t] = !0;
    return;
  }
  var a = t.shift();
  if (a === "PARAMETER" && (a = t.shift()), t.length === 1) {
    if (Array.isArray(t[0])) {
      i[a] = {}, ht(t[0], i[a]);
      return;
    }
    i[a] = t[0];
    return;
  }
  if (!t.length) {
    i[a] = !0;
    return;
  }
  if (a === "TOWGS84") {
    i[a] = t;
    return;
  }
  if (a === "AXIS") {
    a in i || (i[a] = []), i[a].push(t);
    return;
  }
  Array.isArray(a) || (i[a] = {});
  var s;
  switch (a) {
    case "UNIT":
    case "PRIMEM":
    case "VERT_DATUM":
      i[a] = {
        name: t[0].toLowerCase(),
        convert: t[1]
      }, t.length === 3 && ht(t[2], i[a]);
      return;
    case "SPHEROID":
    case "ELLIPSOID":
      i[a] = {
        name: t[0],
        a: t[1],
        rf: t[2]
      }, t.length === 4 && ht(t[3], i[a]);
      return;
    case "EDATUM":
    case "ENGINEERINGDATUM":
    case "LOCAL_DATUM":
    case "DATUM":
    case "VERT_CS":
    case "VERTCRS":
    case "VERTICALCRS":
      t[0] = ["name", t[0]], Vt(i, a, t);
      return;
    case "COMPD_CS":
    case "COMPOUNDCRS":
    case "FITTED_CS":
    // the followings are the crs defined in
    // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
    case "PROJECTEDCRS":
    case "PROJCRS":
    case "GEOGCS":
    case "GEOCCS":
    case "PROJCS":
    case "LOCAL_CS":
    case "GEODCRS":
    case "GEODETICCRS":
    case "GEODETICDATUM":
    case "ENGCRS":
    case "ENGINEERINGCRS":
      t[0] = ["name", t[0]], Vt(i, a, t), i[a].type = a;
      return;
    default:
      for (s = -1; ++s < t.length; )
        if (!Array.isArray(t[s]))
          return ht(t, i[a]);
      return Vt(i, a, t);
  }
}
function wi(t) {
  let i = { units: null, to_meter: void 0 };
  return typeof t == "string" ? (i.units = t.toLowerCase(), i.units === "metre" && (i.units = "meter"), i.units === "meter" && (i.to_meter = 1)) : t && t.name && (i.units = t.name.toLowerCase(), i.units === "metre" && (i.units = "meter"), i.to_meter = t.conversion_factor), i;
}
function ai(t) {
  return typeof t == "object" ? t.value * t.unit.conversion_factor : t;
}
function Pi(t) {
  return typeof t != "object" ? t * Math.PI / 180 : t.unit === "degree" ? t.value * Math.PI / 180 : ai(t);
}
const Xt = Math.PI / 648e3, Gi = [1, 1, 1, Xt, Xt, Xt, 1e-6];
function Oa(t, i) {
  const a = t.unit, s = a && typeof a == "object" ? a.conversion_factor : a === "degree" ? Math.PI / 180 : a === "metre" || a === "unity" ? 1 : null;
  return s && i < Gi.length ? t.value * s / Gi[i] : t.value;
}
function La(t) {
  return t ? t.id && t.id.authority === "EPSG" ? [9607, 1032, 1038].includes(Number(t.id.code)) : /^Coordinate Frame rotation\b/i.test(t.name) : !1;
}
function xi(t, i) {
  t.ellipsoid.radius ? (i.a = t.ellipsoid.radius, i.rf = 0) : (i.a = ai(t.ellipsoid.semi_major_axis), t.ellipsoid.inverse_flattening !== void 0 ? i.rf = t.ellipsoid.inverse_flattening : t.ellipsoid.semi_major_axis !== void 0 && t.ellipsoid.semi_minor_axis !== void 0 && (i.rf = i.a / (i.a - ai(t.ellipsoid.semi_minor_axis))));
}
function Vi(t) {
  return t.type === "BoundCRS" ? !!t.source_crs && Vi(t.source_crs) : t.type === "GeodeticCRS" ? !t.coordinate_system || t.coordinate_system.subtype !== "Cartesian" : t.type === "GeographicCRS" || t.type === "ProjectedCRS";
}
function Et(t, i = {}) {
  if (!t || typeof t != "object")
    return t;
  if (t.type === "CompoundCRS") {
    const a = (t.components || []).find(Vi);
    return a ? Et(a, i) : i;
  }
  if (t.type === "BoundCRS") {
    if (Et(t.source_crs, i), t.transformation) {
      if (t.transformation.method && t.transformation.method.name === "NTv2")
        i.nadgrids = t.transformation.parameters[0].value;
      else if (i.datum_params = t.transformation.parameters.map(Oa), i.datum_params.length >= 6 && La(t.transformation.method))
        for (let a = 3; a < 6; ++a)
          i.datum_params[a] = -i.datum_params[a];
    }
    return i;
  }
  return Object.keys(t).forEach((a) => {
    const s = t[a];
    if (s !== null)
      switch (a) {
        case "name":
          if (i.srsCode)
            break;
          i.name = s, i.srsCode = s;
          break;
        case "type":
          s === "GeographicCRS" ? i.projName = "longlat" : s === "GeodeticCRS" ? t.coordinate_system && t.coordinate_system.subtype === "Cartesian" ? i.projName = "geocent" : i.projName = "longlat" : s === "ProjectedCRS" && t.conversion && t.conversion.method && (i.projName = t.conversion.method.name);
          break;
        case "datum":
        case "datum_ensemble":
          s.ellipsoid && (i.ellps = s.ellipsoid.name, xi(s, i)), s.prime_meridian && (i.from_greenwich = Pi(s.prime_meridian.longitude));
          break;
        case "ellipsoid":
          i.ellps = s.name, xi(s, i);
          break;
        case "prime_meridian":
          i.long0 = Pi(s.longitude || 0);
          break;
        case "coordinate_system":
          if (s.axis) {
            const e = {
              east: "e",
              north: "n",
              west: "w",
              south: "s",
              up: "u",
              down: "d",
              geocentricx: "e",
              geocentricy: "n",
              geocentricz: "u"
            }, r = s.axis.map((n) => e[n.direction.toLowerCase()]);
            if (r.every(Boolean) && (i.axis = r.join(""), i.axis.length === 2 && (i.axis += "u")), s.unit) {
              const { units: n, to_meter: h } = wi(s.unit);
              i.units = n, i.to_meter = h;
            } else if (s.axis[0] && s.axis[0].unit) {
              const { units: n, to_meter: h } = wi(s.axis[0].unit);
              i.units = n, i.to_meter = h;
            }
          }
          break;
        case "id":
          s.authority && s.code && (i.title = s.authority + ":" + s.code);
          break;
        case "conversion":
          s.method && s.method.name && (i.projName = s.method.name), s.parameters && s.parameters.forEach((e) => {
            const r = e.name.toLowerCase().replace(/\s+/g, "_"), n = e.value;
            e.unit && e.unit.conversion_factor ? i[r] = n * e.unit.conversion_factor : e.unit === "degree" ? i[r] = n * Math.PI / 180 : i[r] = n;
          });
          break;
        case "unit":
          s.name && (i.units = s.name.toLowerCase(), i.units === "metre" && (i.units = "meter")), s.conversion_factor && (i.to_meter = s.conversion_factor);
          break;
        case "base_crs":
          Et(s, i), i.datumCode = s.id ? s.id.authority + "_" + s.id.code : s.name;
          break;
      }
  }), !i.datumCode && (t.type === "GeographicCRS" || t.type === "GeodeticCRS") && t.id && (i.datumCode = t.id.authority + "_" + t.id.code), i.latitude_of_false_origin !== void 0 && (i.lat0 = i.latitude_of_false_origin), i.longitude_of_false_origin !== void 0 && (i.long0 = i.longitude_of_false_origin), i.latitude_of_standard_parallel !== void 0 && (i.lat0 = i.latitude_of_standard_parallel, i.lat1 = i.latitude_of_standard_parallel), i.latitude_of_1st_standard_parallel !== void 0 && (i.lat1 = i.latitude_of_1st_standard_parallel), i.latitude_of_2nd_standard_parallel !== void 0 && (i.lat2 = i.latitude_of_2nd_standard_parallel), i.latitude_of_projection_centre !== void 0 && (i.lat0 = i.latitude_of_projection_centre), i.longitude_of_projection_centre !== void 0 && (i.longc = i.longitude_of_projection_centre), i.easting_at_false_origin !== void 0 && (i.x0 = i.easting_at_false_origin), i.northing_at_false_origin !== void 0 && (i.y0 = i.northing_at_false_origin), i.latitude_of_natural_origin !== void 0 && (i.lat0 = i.latitude_of_natural_origin), i.longitude_of_natural_origin !== void 0 && (i.long0 = i.longitude_of_natural_origin), i.longitude_of_origin !== void 0 && (i.long0 = i.longitude_of_origin), i.false_easting !== void 0 && (i.x0 = i.false_easting), i.easting_at_projection_centre && (i.x0 = i.easting_at_projection_centre), i.false_northing !== void 0 && (i.y0 = i.false_northing), i.northing_at_projection_centre && (i.y0 = i.northing_at_projection_centre), i.projection_plane_origin_height !== void 0 && (i.h = i.projection_plane_origin_height), i.satellite_height !== void 0 && (i.h = i.satellite_height), i.viewpoint_height !== void 0 && (i.h = i.viewpoint_height), i.standard_parallel_1 !== void 0 && (i.lat1 = i.standard_parallel_1), i.standard_parallel_2 !== void 0 && (i.lat2 = i.standard_parallel_2), i.scale_factor_at_natural_origin !== void 0 && (i.k0 = i.scale_factor_at_natural_origin), i.scale_factor_at_projection_centre !== void 0 && (i.k0 = i.scale_factor_at_projection_centre), i.scale_factor_on_pseudo_standard_parallel !== void 0 && (i.k0 = i.scale_factor_on_pseudo_standard_parallel), i.azimuth !== void 0 && (i.alpha = i.azimuth), i.azimuth_at_projection_centre !== void 0 && (i.alpha = i.azimuth_at_projection_centre), i.angle_from_rectified_to_skew_grid && (i.rectified_grid_angle = i.angle_from_rectified_to_skew_grid), i.long0 === void 0 && i.central_meridian !== void 0 && (i.long0 = i.central_meridian), i.lat0 === void 0 && i.latitude_of_origin !== void 0 && (i.lat0 = i.latitude_of_origin), i.lat0 === void 0 && i.latitude_of_center !== void 0 && (i.lat0 = i.latitude_of_center), i.longc === void 0 && i.longitude_of_center !== void 0 && (i.longc = i.longitude_of_center), i.k0 === void 0 && i.scale_factor !== void 0 && (i.k0 = i.scale_factor), zi(i), i;
}
var qa = [
  "PROJECTEDCRS",
  "PROJCRS",
  "GEOGCS",
  "GEOCCS",
  "PROJCS",
  "LOCAL_CS",
  "GEODCRS",
  "GEODETICCRS",
  "GEODETICDATUM",
  "ENGCRS",
  "ENGINEERINGCRS"
], Ua = [
  "projName",
  "axis",
  "units",
  "to_meter",
  "datumCode",
  "datum_params",
  "nadgrids",
  "ellps",
  "from_greenwich",
  "a",
  "rf",
  "sphere",
  "k0",
  "x0",
  "y0",
  "long0",
  "longc",
  "lat0",
  "lat1",
  "lat2",
  "lat_ts",
  "alpha",
  "rectified_grid_angle"
];
function Da(t, i) {
  var a = i[0], s = i[1];
  !(a in t) && s in t && (t[a] = t[s], i.length === 3 && (t[a] = i[2](t[a])));
}
function Xi(t) {
  for (var i = Object.keys(t), a = 0, s = i.length; a < s; ++a) {
    var e = i[a];
    qa.indexOf(e) !== -1 && ka(t[e]), typeof t[e] == "object" && Xi(t[e]);
  }
}
function ka(t) {
  if (t.AUTHORITY) {
    var i = Object.keys(t.AUTHORITY)[0];
    i && i in t.AUTHORITY && (t.title = i + ":" + t.AUTHORITY[i]);
  }
  if (t.type === "GEOGCS" ? t.projName = "longlat" : t.type === "LOCAL_CS" ? (t.projName = "identity", t.local = !0) : typeof t.PROJECTION == "object" ? t.projName = Object.keys(t.PROJECTION)[0] : t.projName = t.PROJECTION, t.AXIS) {
    for (var a = "", s = 0, e = t.AXIS.length; s < e; ++s) {
      var r = [t.AXIS[s][0].toLowerCase(), t.AXIS[s][1].toLowerCase()];
      r[0].indexOf("north") !== -1 || (r[0] === "y" || r[0] === "lat") && r[1] === "north" ? a += "n" : r[0].indexOf("south") !== -1 || (r[0] === "y" || r[0] === "lat") && r[1] === "south" ? a += "s" : r[0].indexOf("east") !== -1 || (r[0] === "x" || r[0] === "lon") && r[1] === "east" ? a += "e" : (r[0].indexOf("west") !== -1 || (r[0] === "x" || r[0] === "lon") && r[1] === "west") && (a += "w");
    }
    a.length === 2 && (a += "u"), a.length === 3 && (t.axis = a);
  }
  t.UNIT && (t.units = t.UNIT.name.toLowerCase(), t.units === "metre" && (t.units = "meter"), t.UNIT.convert && (t.type === "GEOGCS" ? t.DATUM && t.DATUM.SPHEROID && (t.to_meter = t.UNIT.convert * t.DATUM.SPHEROID.a) : t.to_meter = t.UNIT.convert));
  var n = t.GEOGCS;
  t.type === "GEOGCS" && (n = t), n && (n.PRIMEM && n.PRIMEM.convert && (t.from_greenwich = ct(n.PRIMEM.convert)), n.DATUM ? t.datumCode = n.DATUM.name.toLowerCase() : t.datumCode = n.name.toLowerCase(), t.datumCode.slice(0, 2) === "d_" && (t.datumCode = t.datumCode.slice(2)), t.datumCode === "new_zealand_1949" && (t.datumCode = "nzgd49"), (t.datumCode === "wgs_1984" || t.datumCode === "world_geodetic_system_1984") && (t.PROJECTION === "Mercator_Auxiliary_Sphere" && (t.sphere = !0), t.datumCode = "wgs84"), t.datumCode === "belge_1972" && (t.datumCode = "rnb72"), n.DATUM && n.DATUM.SPHEROID && (t.ellps = n.DATUM.SPHEROID.name.replace("_19", "").replace(/[Cc]larke\_18/, "clrk"), t.ellps.toLowerCase().slice(0, 13) === "international" && (t.ellps = "intl"), t.a = n.DATUM.SPHEROID.a, t.rf = parseFloat(n.DATUM.SPHEROID.rf)), n.DATUM && n.DATUM.TOWGS84 && (t.datum_params = n.DATUM.TOWGS84), ~t.datumCode.indexOf("osgb_1936") && (t.datumCode = "osgb36"), ~t.datumCode.indexOf("osni_1952") && (t.datumCode = "osni52"), (~t.datumCode.indexOf("tm65") || ~t.datumCode.indexOf("geodetic_datum_of_1965")) && (t.datumCode = "ire65"), t.datumCode === "ch1903+" && (t.datumCode = "ch1903"), ~t.datumCode.indexOf("israel") && (t.datumCode = "isr93")), t.b && !isFinite(t.b) && (t.b = t.a);
  var h = n && n.UNIT && n.UNIT.convert, o = h && Math.abs(h / ct(1) - 1) > 1e-9 ? function(u) {
    return u * h;
  } : ct;
  t.rectified_grid_angle && (t.rectified_grid_angle = o(t.rectified_grid_angle));
  function l(u) {
    var g = t.to_meter || 1;
    return u * g;
  }
  var _ = function(u) {
    return Da(t, u);
  }, f = [
    ["standard_parallel_1", "Standard_Parallel_1"],
    ["standard_parallel_1", "Latitude of 1st standard parallel"],
    ["standard_parallel_2", "Standard_Parallel_2"],
    ["standard_parallel_2", "Latitude of 2nd standard parallel"],
    ["false_easting", "False_Easting"],
    ["false_easting", "False easting"],
    ["false-easting", "Easting at false origin"],
    ["false_northing", "False_Northing"],
    ["false_northing", "False northing"],
    ["false_northing", "Northing at false origin"],
    ["central_meridian", "Central_Meridian"],
    ["central_meridian", "Longitude of natural origin"],
    ["central_meridian", "Longitude of false origin"],
    ["latitude_of_origin", "Latitude_Of_Origin"],
    ["latitude_of_origin", "Central_Parallel"],
    ["latitude_of_origin", "Latitude of natural origin"],
    ["latitude_of_origin", "Latitude of false origin"],
    ["scale_factor", "Scale_Factor"],
    ["k0", "scale_factor"],
    ["latitude_of_center", "Latitude_Of_Center"],
    ["latitude_of_center", "Latitude_of_center"],
    ["lat0", "latitude_of_center", o],
    ["longitude_of_center", "Longitude_Of_Center"],
    ["longitude_of_center", "Longitude_of_center"],
    ["longc", "longitude_of_center", o],
    ["x0", "false_easting", l],
    ["y0", "false_northing", l],
    ["long0", "central_meridian", o],
    ["lat0", "latitude_of_origin", o],
    ["lat1", "standard_parallel_1", o],
    ["lat2", "standard_parallel_2", o],
    ["h", "Height", l],
    ["azimuth", "Azimuth"],
    ["alpha", "azimuth", o],
    ["srsCode", "name"]
  ];
  f.forEach(_), $i(t.projName) || _(["lat0", "standard_parallel_1", o]), zi(t);
}
function zt(t) {
  if (typeof t == "object")
    return Et(t);
  const i = Ia(t);
  var a = pa(t);
  if (i === "WKT2") {
    const h = Na(a);
    return Et(h);
  }
  var s = a[0], e = {};
  ht(a, e), Xi(e);
  var r = e[s];
  if (s === "COMPD_CS") {
    var n = r.PROJCS || r.GEOGCS;
    n && Ua.forEach(function(h) {
      h in n && (r[h] = n[h]);
    });
  }
  return r;
}
function p(t) {
  var i = this;
  if (arguments.length === 2) {
    var a = arguments[1];
    typeof a == "string" ? a.charAt(0) === "+" ? p[
      /** @type {string} */
      t
    ] = ii(arguments[1]) : p[
      /** @type {string} */
      t
    ] = zt(arguments[1]) : a && typeof a == "object" && !("projName" in a) ? p[
      /** @type {string} */
      t
    ] = zt(arguments[1]) : (p[
      /** @type {string} */
      t
    ] = a, a || delete p[
      /** @type {string} */
      t
    ]);
  } else if (arguments.length === 1) {
    if (Array.isArray(t))
      return t.map(function(s) {
        return Array.isArray(s) ? p.apply(i, s) : p(s);
      });
    if (typeof t == "string") {
      if (t in p)
        return p[t];
    } else "EPSG" in t ? p["EPSG:" + t.EPSG] = t : "ESRI" in t ? p["ESRI:" + t.ESRI] = t : "IAU2000" in t ? p["IAU2000:" + t.IAU2000] = t : console.log(t);
    return;
  }
}
ma(p);
function Fa(t) {
  return typeof t == "string";
}
function $a(t) {
  return t in p;
}
function za(t) {
  return t.indexOf("+") !== 0 && t.indexOf("[") !== -1 || typeof t == "object" && !("srsCode" in t);
}
var bi = ["3857", "900913", "3785", "102113"];
function Ba(t) {
  if (t.title)
    return t.title.toLowerCase().indexOf("epsg:") === 0 && bi.indexOf(t.title.substr(5)) > -1;
  var i = X(t, "authority");
  if (i) {
    var a = X(i, "epsg");
    return a && bi.indexOf(a) > -1;
  }
}
function ja(t) {
  var i = X(t, "extension");
  if (i)
    return X(i, "proj4");
}
function Wa(t) {
  return t[0] === "+";
}
function Ha(t) {
  let i;
  if (Fa(t))
    if ($a(t))
      i = p[t];
    else if (za(t)) {
      i = zt(t);
      var a = ja(i);
      a && (i = ii(a));
    } else Wa(t) && (i = ii(t));
  else "projName" in t ? i = t : i = zt(t);
  return i && Ba(i) ? p["EPSG:3857"] : i;
}
function Ai(t, i) {
  t = t || {};
  var a, s;
  if (!i)
    return t;
  for (s in i)
    a = i[s], a !== void 0 && (t[s] = a);
  return t;
}
function H(t, i, a) {
  var s = t * i;
  return a / Math.sqrt(1 - s * s);
}
function It(t) {
  return t < 0 ? -1 : 1;
}
function y(t, i) {
  return i || Math.abs(t) <= R ? t : t - It(t) * xt;
}
function j(t, i, a) {
  var s = t * a, e = 0.5 * t;
  return s = Math.pow((1 - s) / (1 + s), e), Math.tan(0.5 * (d - i)) / s;
}
function At(t, i) {
  for (var a = 0.5 * t, s, e, r = d - 2 * Math.atan(i), n = 0; n <= 15; n++)
    if (s = t * Math.sin(r), e = d - 2 * Math.atan(i * Math.pow((1 - s) / (1 + s), a)) - r, r += e, Math.abs(e) <= 1e-10)
      return r;
  return -9999;
}
function Qa() {
  var t = this.b / this.a;
  this.es = 1 - t * t, "x0" in this || (this.x0 = 0), "y0" in this || (this.y0 = 0), this.long0 = this.long0 || 0, this.e = Math.sqrt(this.es), this.lat_ts ? this.sphere ? this.k0 = Math.cos(this.lat_ts) : this.k0 = H(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) : this.k0 || (this.k ? this.k0 = this.k : this.k0 = 1);
}
function Ka(t) {
  var i = t.x, a = t.y;
  if (a * k > 90 && a * k < -90 && i * k > 180 && i * k < -180)
    return null;
  var s, e;
  if (Math.abs(Math.abs(a) - d) <= m)
    return null;
  if (this.sphere)
    s = this.x0 + this.a * this.k0 * y(i - this.long0, this.over), e = this.y0 + this.a * this.k0 * Math.log(Math.tan(b + 0.5 * a));
  else {
    var r = Math.sin(a), n = j(this.e, a, r);
    s = this.x0 + this.a * this.k0 * y(i - this.long0, this.over), e = this.y0 - this.a * this.k0 * Math.log(n);
  }
  return t.x = s, t.y = e, t;
}
function Va(t) {
  var i = t.x - this.x0, a = t.y - this.y0, s, e;
  if (this.sphere)
    e = d - 2 * Math.atan(Math.exp(-a / (this.a * this.k0)));
  else {
    var r = Math.exp(-a / (this.a * this.k0));
    if (e = At(this.e, r), e === -9999)
      return null;
  }
  return s = y(this.long0 + i / (this.a * this.k0), this.over), t.x = s, t.y = e, t;
}
var Xa = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "Mercator_Variant_A", "merc"];
const Ja = {
  init: Qa,
  forward: Ka,
  inverse: Va,
  names: Xa
};
function Za() {
}
function Ni(t) {
  return t;
}
var Ji = ["longlat", "identity", "lonlat", "latlon", "latlong"];
const Ya = {
  init: Za,
  forward: Ni,
  inverse: Ni,
  names: Ji
};
var ts = [Ja, Ya], Y = {}, nt = [];
function Zi(t, i) {
  var a = nt.length;
  return t.names ? (nt[a] = t, t.names.forEach(function(s) {
    Y[s.toLowerCase()] = a;
  }), this) : (console.log(i), !0);
}
function Yi(t) {
  return t.replace(/[-\(\)\s]+/g, " ").trim().replace(/ /g, "_");
}
function is(t) {
  if (!t)
    return !1;
  var i = t.toLowerCase();
  if (typeof Y[i] < "u" && nt[Y[i]] || (i = Yi(i), i in Y && nt[Y[i]]))
    return nt[Y[i]];
}
function as() {
  ts.forEach(Zi);
}
const ss = {
  start: as,
  add: Zi,
  get: is
};
var ta = {
  MERIT: {
    a: 6378137,
    rf: 298.257,
    ellipseName: "MERIT 1983"
  },
  SGS85: {
    a: 6378136,
    rf: 298.257,
    ellipseName: "Soviet Geodetic System 85"
  },
  GRS80: {
    a: 6378137,
    rf: 298.257222101,
    ellipseName: "GRS 1980(IUGG, 1980)"
  },
  IAU76: {
    a: 6378140,
    rf: 298.257,
    ellipseName: "IAU 1976"
  },
  airy: {
    a: 6377563396e-3,
    b: 635625691e-2,
    ellipseName: "Airy 1830"
  },
  APL4: {
    a: 6378137,
    rf: 298.25,
    ellipseName: "Appl. Physics. 1965"
  },
  NWL9D: {
    a: 6378145,
    rf: 298.25,
    ellipseName: "Naval Weapons Lab., 1965"
  },
  mod_airy: {
    a: 6377340189e-3,
    b: 6356034446e-3,
    ellipseName: "Modified Airy"
  },
  andrae: {
    a: 637710443e-2,
    rf: 300,
    ellipseName: "Andrae 1876 (Den., Iclnd.)"
  },
  aust_SA: {
    a: 6378160,
    rf: 298.25,
    ellipseName: "Australian Natl & S. Amer. 1969"
  },
  GRS67: {
    a: 6378160,
    rf: 298.247167427,
    ellipseName: "GRS 67(IUGG 1967)"
  },
  bessel: {
    a: 6377397155e-3,
    rf: 299.1528128,
    ellipseName: "Bessel 1841"
  },
  bess_nam: {
    a: 6377483865e-3,
    rf: 299.1528128,
    ellipseName: "Bessel 1841 (Namibia)"
  },
  clrk66: {
    a: 63782064e-1,
    b: 63565838e-1,
    ellipseName: "Clarke 1866"
  },
  clrk80: {
    a: 6378249145e-3,
    rf: 293.4663,
    ellipseName: "Clarke 1880 mod."
  },
  clrk80ign: {
    a: 63782492e-1,
    b: 6356515,
    rf: 293.4660213,
    ellipseName: "Clarke 1880 (IGN)"
  },
  clrk58: {
    a: 6378293645208759e-9,
    rf: 294.2606763692654,
    ellipseName: "Clarke 1858"
  },
  CPM: {
    a: 63757387e-1,
    rf: 334.29,
    ellipseName: "Comm. des Poids et Mesures 1799"
  },
  delmbr: {
    a: 6376428,
    rf: 311.5,
    ellipseName: "Delambre 1810 (Belgium)"
  },
  engelis: {
    a: 637813605e-2,
    rf: 298.2566,
    ellipseName: "Engelis 1985"
  },
  evrst30: {
    a: 6377276345e-3,
    rf: 300.8017,
    ellipseName: "Everest 1830"
  },
  evrst48: {
    a: 6377304063e-3,
    rf: 300.8017,
    ellipseName: "Everest 1948"
  },
  evrst56: {
    a: 6377301243e-3,
    rf: 300.8017,
    ellipseName: "Everest 1956"
  },
  evrst69: {
    a: 6377295664e-3,
    rf: 300.8017,
    ellipseName: "Everest 1969"
  },
  evrstSS: {
    a: 6377298556e-3,
    rf: 300.8017,
    ellipseName: "Everest (Sabah & Sarawak)"
  },
  fschr60: {
    a: 6378166,
    rf: 298.3,
    ellipseName: "Fischer (Mercury Datum) 1960"
  },
  fschr60m: {
    a: 6378155,
    rf: 298.3,
    ellipseName: "Fischer 1960"
  },
  fschr68: {
    a: 6378150,
    rf: 298.3,
    ellipseName: "Fischer 1968"
  },
  helmert: {
    a: 6378200,
    rf: 298.3,
    ellipseName: "Helmert 1906"
  },
  hough: {
    a: 6378270,
    rf: 297,
    ellipseName: "Hough"
  },
  intl: {
    a: 6378388,
    rf: 297,
    ellipseName: "International 1909 (Hayford)"
  },
  kaula: {
    a: 6378163,
    rf: 298.24,
    ellipseName: "Kaula 1961"
  },
  lerch: {
    a: 6378139,
    rf: 298.257,
    ellipseName: "Lerch 1979"
  },
  mprts: {
    a: 6397300,
    rf: 191,
    ellipseName: "Maupertius 1738"
  },
  new_intl: {
    a: 63781575e-1,
    b: 63567722e-1,
    ellipseName: "New International 1967"
  },
  plessis: {
    a: 6376523,
    b: 6355863,
    ellipseName: "Plessis 1817 (France)"
  },
  krass: {
    a: 6378245,
    rf: 298.3,
    ellipseName: "Krassovsky, 1942"
  },
  SEasia: {
    a: 6378155,
    b: 63567733205e-4,
    ellipseName: "Southeast Asia"
  },
  walbeck: {
    a: 6376896,
    b: 63558348467e-4,
    ellipseName: "Walbeck"
  },
  WGS60: {
    a: 6378165,
    rf: 298.3,
    ellipseName: "WGS 60"
  },
  WGS66: {
    a: 6378145,
    rf: 298.25,
    ellipseName: "WGS 66"
  },
  WGS7: {
    a: 6378135,
    rf: 298.26,
    ellipseName: "WGS 72"
  },
  WGS84: {
    a: 6378137,
    rf: 298.257223563,
    ellipseName: "WGS 84"
  },
  sphere: {
    a: 6370997,
    b: 6370997,
    ellipseName: "Normal Sphere (r=6370997)"
  }
};
const es = ta.WGS84;
function rs(t, i, a, s) {
  var e = t * t, r = i * i, n = (e - r) / e, h = 0;
  s ? (t *= 1 - n * (Sa + n * (wa + n * Pa)), e = t * t, n = 0) : h = Math.sqrt(n);
  var o = (e - r) / r;
  return {
    es: n,
    e: h,
    ep2: o
  };
}
function hs(t, i, a, s, e) {
  if (!t) {
    var r = X(ta, s);
    r || (r = es), t = r.a, i = r.b, a = r.rf;
  }
  return a && !i && (i = (1 - 1 / a) * t), (a === 0 || Math.abs(t - i) < m) && (e = !0, i = t), {
    a: t,
    b: i,
    rf: a,
    sphere: e
  };
}
var Ut = {
  wgs84: {
    towgs84: "0,0,0",
    ellipse: "WGS84",
    datumName: "WGS84"
  },
  ch1903: {
    towgs84: "674.374,15.056,405.346",
    ellipse: "bessel",
    datumName: "swiss"
  },
  ggrs87: {
    towgs84: "-199.87,74.79,246.62",
    ellipse: "GRS80",
    datumName: "Greek_Geodetic_Reference_System_1987"
  },
  nad83: {
    towgs84: "0,0,0",
    ellipse: "GRS80",
    datumName: "North_American_Datum_1983"
  },
  nad27: {
    nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
    ellipse: "clrk66",
    datumName: "North_American_Datum_1927"
  },
  potsdam: {
    towgs84: "598.1,73.7,418.2,0.202,0.045,-2.455,6.7",
    ellipse: "bessel",
    datumName: "Potsdam Rauenberg 1950 DHDN"
  },
  carthage: {
    towgs84: "-263.0,6.0,431.0",
    ellipse: "clrk80ign",
    datumName: "Carthage 1934 Tunisia"
  },
  hermannskogel: {
    towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
    ellipse: "bessel",
    datumName: "Hermannskogel"
  },
  mgi: {
    towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
    ellipse: "bessel",
    datumName: "Militar-Geographische Institut"
  },
  osni52: {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "airy",
    datumName: "Irish National"
  },
  ire65: {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "mod_airy",
    datumName: "Ireland 1965"
  },
  rassadiran: {
    towgs84: "-133.63,-157.5,-158.62",
    ellipse: "intl",
    datumName: "Rassadiran"
  },
  nzgd49: {
    towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
    ellipse: "intl",
    datumName: "New Zealand Geodetic Datum 1949"
  },
  osgb36: {
    towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
    ellipse: "airy",
    datumName: "Ordnance Survey of Great Britain 1936"
  },
  s_jtsk: {
    towgs84: "589,76,480",
    ellipse: "bessel",
    datumName: "S-JTSK (Ferro)"
  },
  beduaram: {
    towgs84: "-106,-87,188",
    ellipse: "clrk80",
    datumName: "Beduaram"
  },
  gunung_segara: {
    towgs84: "-403,684,41",
    ellipse: "bessel",
    datumName: "Gunung Segara Jakarta"
  },
  rnb72: {
    towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
    ellipse: "intl",
    datumName: "Reseau National Belge 1972"
  },
  EPSG_5451: {
    towgs84: "6.41,-49.05,-11.28,1.5657,0.5242,6.9718,-5.7649"
  },
  IGNF_LURESG: {
    towgs84: "-192.986,13.673,-39.309,-0.4099,-2.9332,2.6881,0.43"
  },
  EPSG_4614: {
    towgs84: "-119.4248,-303.65872,-11.00061,1.164298,0.174458,1.096259,3.657065"
  },
  EPSG_4615: {
    towgs84: "-494.088,-312.129,279.877,-1.423,-1.013,1.59,-0.748"
  },
  ESRI_37241: {
    towgs84: "-76.822,257.457,-12.817,2.136,-0.033,-2.392,-0.031"
  },
  ESRI_37249: {
    towgs84: "-440.296,58.548,296.265,1.128,10.202,4.559,-0.438"
  },
  ESRI_37245: {
    towgs84: "-511.151,-181.269,139.609,1.05,2.703,1.798,3.071"
  },
  EPSG_4178: {
    towgs84: "24.9,-126.4,-93.2,-0.063,-0.247,-0.041,1.01"
  },
  EPSG_4622: {
    towgs84: "-472.29,-5.63,-304.12,0.4362,-0.8374,0.2563,1.8984"
  },
  EPSG_4625: {
    towgs84: "126.93,547.94,130.41,-2.7867,5.1612,-0.8584,13.8227"
  },
  EPSG_5252: {
    towgs84: "0.023,0.036,-0.068,0.00176,0.00912,-0.01136,0.00439"
  },
  EPSG_4314: {
    towgs84: "597.1,71.4,412.1,0.894,0.068,-1.563,7.58"
  },
  EPSG_4282: {
    towgs84: "-178.3,-316.7,-131.5,5.278,6.077,10.979,19.166"
  },
  EPSG_4231: {
    towgs84: "-83.11,-97.38,-117.22,0.005693,-0.044698,0.044285,0.1218"
  },
  EPSG_4274: {
    towgs84: "-230.994,102.591,25.199,0.633,-0.239,0.9,1.95"
  },
  EPSG_4134: {
    towgs84: "-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.71006"
  },
  EPSG_4254: {
    towgs84: "18.38,192.45,96.82,0.056,-0.142,-0.2,-0.0013"
  },
  EPSG_4159: {
    towgs84: "-194.513,-63.978,-25.759,-3.4027,3.756,-3.352,-0.9175"
  },
  EPSG_4687: {
    towgs84: "0.072,-0.507,-0.245,0.0183,-0.0003,0.007,-0.0093"
  },
  EPSG_4227: {
    towgs84: "-83.58,-397.54,458.78,-17.595,-2.847,4.256,3.225"
  },
  EPSG_4746: {
    towgs84: "599.4,72.4,419.2,-0.062,-0.022,-2.723,6.46"
  },
  EPSG_4745: {
    towgs84: "612.4,77,440.2,-0.054,0.057,-2.797,2.55"
  },
  EPSG_6311: {
    towgs84: "8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926"
  },
  EPSG_4289: {
    towgs84: "565.7381,50.4018,465.2904,-0.395026,0.330772,-1.876073,4.07244"
  },
  EPSG_4230: {
    towgs84: "-68.863,-134.888,-111.49,-0.53,-0.14,0.57,-3.4"
  },
  EPSG_4154: {
    towgs84: "-123.02,-158.95,-168.47"
  },
  EPSG_4156: {
    towgs84: "570.8,85.7,462.8,4.998,1.587,5.261,3.56"
  },
  EPSG_4299: {
    towgs84: "482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"
  },
  EPSG_4179: {
    towgs84: "33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84"
  },
  EPSG_4313: {
    towgs84: "-106.8686,52.2978,-103.7239,0.3366,-0.457,1.8422,-1.2747"
  },
  EPSG_4194: {
    towgs84: "163.511,127.533,-159.789"
  },
  EPSG_4195: {
    towgs84: "105,326,-102.5"
  },
  EPSG_4196: {
    towgs84: "-45,417,-3.5"
  },
  EPSG_4611: {
    towgs84: "-162.619,-276.959,-161.764,0.067753,-2.243648,-1.158828,-1.094246"
  },
  EPSG_4633: {
    towgs84: "137.092,131.66,91.475,-1.9436,-11.5993,-4.3321,-7.4824"
  },
  EPSG_4641: {
    towgs84: "-408.809,366.856,-412.987,1.8842,-0.5308,2.1655,-121.0993"
  },
  EPSG_4643: {
    towgs84: "-480.26,-438.32,-643.429,16.3119,20.1721,-4.0349,-111.7002"
  },
  EPSG_4300: {
    towgs84: "482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"
  },
  EPSG_4188: {
    towgs84: "482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"
  },
  EPSG_4660: {
    towgs84: "982.6087,552.753,-540.873,6.681627,-31.611492,-19.848161,16.805"
  },
  EPSG_4662: {
    towgs84: "97.295,-263.247,310.882,-1.5999,0.8386,3.1409,13.3259"
  },
  EPSG_3906: {
    towgs84: "577.88891,165.22205,391.18289,4.9145,-0.94729,-13.05098,7.78664"
  },
  EPSG_4307: {
    towgs84: "-209.3622,-87.8162,404.6198,0.0046,3.4784,0.5805,-1.4547"
  },
  EPSG_6892: {
    towgs84: "-76.269,-16.683,68.562,-6.275,10.536,-4.286,-13.686"
  },
  EPSG_4690: {
    towgs84: "221.597,152.441,176.523,2.403,1.3893,0.884,11.4648"
  },
  EPSG_4691: {
    towgs84: "218.769,150.75,176.75,3.5231,2.0037,1.288,10.9817"
  },
  EPSG_4629: {
    towgs84: "72.51,345.411,79.241,-1.5862,-0.8826,-0.5495,1.3653"
  },
  EPSG_4630: {
    towgs84: "165.804,216.213,180.26,-0.6251,-0.4515,-0.0721,7.4111"
  },
  EPSG_4692: {
    towgs84: "217.109,86.452,23.711,0.0183,-0.0003,0.007,-0.0093"
  },
  EPSG_9333: {
    towgs84: "0,0,0,-0.008393,0.000749,-0.010276,0"
  },
  EPSG_9059: {
    towgs84: "0,0,0"
  },
  EPSG_4312: {
    towgs84: "601.705,84.263,485.227,4.7354,1.3145,5.393,-2.3887"
  },
  EPSG_4123: {
    towgs84: "-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496"
  },
  EPSG_4309: {
    towgs84: "-124.45,183.74,44.64,-0.4384,0.5446,-0.9706,-2.1365"
  },
  ESRI_104106: {
    towgs84: "-283.088,-70.693,117.445,-1.157,0.059,-0.652,-4.058"
  },
  EPSG_4281: {
    towgs84: "-219.247,-73.802,269.529"
  },
  EPSG_4322: {
    towgs84: "0,0,4.5"
  },
  EPSG_4324: {
    towgs84: "0,0,1.9"
  },
  EPSG_4284: {
    towgs84: "43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549"
  },
  EPSG_4277: {
    towgs84: "446.448,-125.157,542.06,0.15,0.247,0.842,-20.489"
  },
  EPSG_4207: {
    towgs84: "-282.1,-72.2,120,-1.529,0.145,-0.89,-4.46"
  },
  EPSG_4688: {
    towgs84: "347.175,1077.618,2623.677,33.9058,-70.6776,9.4013,186.0647"
  },
  EPSG_4689: {
    towgs84: "410.793,54.542,80.501,-2.5596,-2.3517,-0.6594,17.3218"
  },
  EPSG_4720: {
    towgs84: "0,0,4.5"
  },
  EPSG_4273: {
    towgs84: "278.3,93,474.5,7.889,0.05,-6.61,6.21"
  },
  EPSG_4240: {
    towgs84: "204.64,834.74,293.8"
  },
  EPSG_4817: {
    towgs84: "278.3,93,474.5,7.889,0.05,-6.61,6.21"
  },
  ESRI_104131: {
    towgs84: "426.62,142.62,460.09,4.98,4.49,-12.42,-17.1"
  },
  EPSG_4265: {
    towgs84: "-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68"
  },
  EPSG_4263: {
    towgs84: "-111.92,-87.85,114.5,1.875,0.202,0.219,0.032"
  },
  EPSG_4298: {
    towgs84: "-689.5937,623.84046,-65.93566,-0.02331,1.17094,-0.80054,5.88536"
  },
  EPSG_4270: {
    towgs84: "-253.4392,-148.452,386.5267,0.15605,0.43,-0.1013,-0.0424"
  },
  EPSG_4229: {
    towgs84: "-121.8,98.1,-10.7"
  },
  EPSG_4220: {
    towgs84: "-55.5,-348,-229.2"
  },
  EPSG_4214: {
    towgs84: "12.646,-155.176,-80.863"
  },
  EPSG_4232: {
    towgs84: "-345,3,223"
  },
  EPSG_4238: {
    towgs84: "-1.977,-13.06,-9.993,0.364,0.254,0.689,-1.037"
  },
  EPSG_4168: {
    towgs84: "-170,33,326"
  },
  EPSG_4131: {
    towgs84: "199,931,318.9"
  },
  EPSG_4152: {
    towgs84: "-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"
  },
  EPSG_5228: {
    towgs84: "572.213,85.334,461.94,4.9732,1.529,5.2484,3.5378"
  },
  EPSG_8351: {
    towgs84: "485.021,169.465,483.839,7.786342,4.397554,4.102655,0"
  },
  EPSG_4683: {
    towgs84: "-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06"
  },
  EPSG_4133: {
    towgs84: "0,0,0"
  },
  EPSG_7373: {
    towgs84: "0.819,-0.5762,-1.6446,-0.00378,-0.03317,0.00318,0.0693"
  },
  EPSG_9075: {
    towgs84: "-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"
  },
  EPSG_9072: {
    towgs84: "-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"
  },
  EPSG_9294: {
    towgs84: "1.16835,-1.42001,-2.24431,-0.00822,-0.05508,0.01818,0.23388"
  },
  EPSG_4212: {
    towgs84: "-267.434,173.496,181.814,-13.4704,8.7154,7.3926,14.7492"
  },
  EPSG_4191: {
    towgs84: "-44.183,-0.58,-38.489,2.3867,2.7072,-3.5196,-8.2703"
  },
  EPSG_4237: {
    towgs84: "52.684,-71.194,-13.975,-0.312,-0.1063,-0.3729,1.0191"
  },
  EPSG_4740: {
    towgs84: "-1.08,-0.27,-0.9"
  },
  EPSG_4124: {
    towgs84: "419.3836,99.3335,591.3451,0.850389,1.817277,-7.862238,-0.99496"
  },
  EPSG_5681: {
    towgs84: "584.9636,107.7175,413.8067,1.1155,0.2824,-3.1384,7.9922"
  },
  EPSG_4141: {
    towgs84: "23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262"
  },
  EPSG_4204: {
    towgs84: "-85.645,-273.077,-79.708,2.289,-1.421,2.532,3.194"
  },
  EPSG_4319: {
    towgs84: "226.702,-193.337,-35.371,-2.229,-4.391,9.238,0.9798"
  },
  EPSG_4200: {
    towgs84: "24.82,-131.21,-82.66"
  },
  EPSG_4130: {
    towgs84: "0,0,0"
  },
  EPSG_4127: {
    towgs84: "-82.875,-57.097,-156.768,-2.158,1.524,-0.982,-0.359"
  },
  EPSG_4149: {
    towgs84: "674.374,15.056,405.346"
  },
  EPSG_4617: {
    towgs84: "-0.991,1.9072,0.5129,0.02579,0.00965,0.01166,0"
  },
  EPSG_4663: {
    towgs84: "-210.502,-66.902,-48.476,2.094,-15.067,-5.817,0.485"
  },
  EPSG_4664: {
    towgs84: "-211.939,137.626,58.3,-0.089,0.251,0.079,0.384"
  },
  EPSG_4665: {
    towgs84: "-105.854,165.589,-38.312,-0.003,-0.026,0.024,-0.048"
  },
  EPSG_4666: {
    towgs84: "631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"
  },
  EPSG_4756: {
    towgs84: "-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188"
  },
  EPSG_4723: {
    towgs84: "-179.483,-69.379,-27.584,-7.862,8.163,6.042,-13.925"
  },
  EPSG_4726: {
    towgs84: "8.853,-52.644,180.304,-0.393,-2.323,2.96,-24.081"
  },
  EPSG_4267: {
    towgs84: "-8.0,160.0,176.0"
  },
  EPSG_5365: {
    towgs84: "-0.16959,0.35312,0.51846,0.03385,-0.16325,0.03446,0.03693"
  },
  EPSG_4218: {
    towgs84: "304.5,306.5,-318.1"
  },
  EPSG_4242: {
    towgs84: "-33.722,153.789,94.959,-8.581,-4.478,4.54,8.95"
  },
  EPSG_4216: {
    towgs84: "-292.295,248.758,429.447,4.9971,2.99,6.6906,1.0289"
  },
  ESRI_104105: {
    towgs84: "631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"
  },
  ESRI_104129: {
    towgs84: "0,0,0"
  },
  EPSG_4673: {
    towgs84: "174.05,-25.49,112.57"
  },
  EPSG_4202: {
    towgs84: "-124,-60,154"
  },
  EPSG_4203: {
    towgs84: "-117.763,-51.51,139.061,0.292,0.443,0.277,-0.191"
  },
  EPSG_3819: {
    towgs84: "595.48,121.69,515.35,4.115,-2.9383,0.853,-3.408"
  },
  EPSG_8694: {
    towgs84: "-93.799,-132.737,-219.073,-1.844,0.648,-6.37,-0.169"
  },
  EPSG_4145: {
    towgs84: "275.57,676.78,229.6"
  },
  EPSG_4283: {
    towgs84: "0.06155,-0.01087,-0.04019,0.039492,0.032722,0.032898,-0.009994"
  },
  EPSG_4317: {
    towgs84: "2.3287,-147.0425,-92.0802,-0.309248,0.324822,0.497299,5.689063"
  },
  EPSG_4272: {
    towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993"
  },
  EPSG_4248: {
    towgs84: "-307.7,265.3,-363.5"
  },
  EPSG_5561: {
    towgs84: "24,-121,-76"
  },
  EPSG_5233: {
    towgs84: "-0.293,766.95,87.713,0.195704,1.695068,3.473016,-0.039338"
  },
  ESRI_104130: {
    towgs84: "-86,-98,-119"
  },
  ESRI_104102: {
    towgs84: "682,-203,480"
  },
  ESRI_37207: {
    towgs84: "7,-10,-26"
  },
  EPSG_4675: {
    towgs84: "59.935,118.4,-10.871"
  },
  ESRI_104109: {
    towgs84: "-89.121,-348.182,260.871"
  },
  ESRI_104112: {
    towgs84: "-185.583,-230.096,281.361"
  },
  ESRI_104113: {
    towgs84: "25.1,-275.6,222.6"
  },
  IGNF_WGS72G: {
    towgs84: "0,12,6"
  },
  IGNF_NTFG: {
    towgs84: "-168,-60,320"
  },
  IGNF_EFATE57G: {
    towgs84: "-127,-769,472"
  },
  IGNF_PGP50G: {
    towgs84: "324.8,153.6,172.1"
  },
  IGNF_REUN47G: {
    towgs84: "94,-948,-1262"
  },
  IGNF_CSG67G: {
    towgs84: "-186,230,110"
  },
  IGNF_GUAD48G: {
    towgs84: "-467,-16,-300"
  },
  IGNF_TAHI51G: {
    towgs84: "162,117,154"
  },
  IGNF_TAHAAG: {
    towgs84: "65,342,77"
  },
  IGNF_NUKU72G: {
    towgs84: "84,274,65"
  },
  IGNF_PETRELS72G: {
    towgs84: "365,194,166"
  },
  IGNF_WALL78G: {
    towgs84: "253,-133,-127"
  },
  IGNF_MAYO50G: {
    towgs84: "-382,-59,-262"
  },
  IGNF_TANNAG: {
    towgs84: "-139,-967,436"
  },
  IGNF_IGN72G: {
    towgs84: "-13,-348,292"
  },
  IGNF_ATIGG: {
    towgs84: "1118,23,66"
  },
  IGNF_FANGA84G: {
    towgs84: "150.57,158.33,118.32"
  },
  IGNF_RUSAT84G: {
    towgs84: "202.13,174.6,-15.74"
  },
  IGNF_KAUE70G: {
    towgs84: "126.74,300.1,-75.49"
  },
  IGNF_MOP90G: {
    towgs84: "-10.8,-1.8,12.77"
  },
  IGNF_MHPF67G: {
    towgs84: "338.08,212.58,-296.17"
  },
  IGNF_TAHI79G: {
    towgs84: "160.61,116.05,153.69"
  },
  IGNF_ANAA92G: {
    towgs84: "1.5,3.84,4.81"
  },
  IGNF_MARQUI72G: {
    towgs84: "330.91,-13.92,58.56"
  },
  IGNF_APAT86G: {
    towgs84: "143.6,197.82,74.05"
  },
  IGNF_TUBU69G: {
    towgs84: "237.17,171.61,-77.84"
  },
  IGNF_STPM50G: {
    towgs84: "11.363,424.148,373.13"
  },
  EPSG_4150: {
    towgs84: "674.374,15.056,405.346"
  },
  EPSG_4754: {
    towgs84: "-208.4058,-109.8777,-2.5764"
  },
  ESRI_104101: {
    towgs84: "372.87,149.23,585.29"
  },
  EPSG_4693: {
    towgs84: "0,-0.15,0.68"
  },
  EPSG_6207: {
    towgs84: "293.17,726.18,245.36"
  },
  EPSG_4153: {
    towgs84: "-133.63,-157.5,-158.62"
  },
  EPSG_4132: {
    towgs84: "-241.54,-163.64,396.06"
  },
  EPSG_4221: {
    towgs84: "-154.5,150.7,100.4"
  },
  EPSG_4266: {
    towgs84: "-80.7,-132.5,41.1"
  },
  EPSG_4193: {
    towgs84: "-70.9,-151.8,-41.4"
  },
  EPSG_5340: {
    towgs84: "-0.41,0.46,-0.35"
  },
  EPSG_4246: {
    towgs84: "-294.7,-200.1,525.5"
  },
  EPSG_4318: {
    towgs84: "-3.2,-5.7,2.8"
  },
  EPSG_4121: {
    towgs84: "-199.87,74.79,246.62"
  },
  EPSG_4223: {
    towgs84: "-260.1,5.5,432.2"
  },
  EPSG_4158: {
    towgs84: "-0.465,372.095,171.736"
  },
  EPSG_4285: {
    towgs84: "-128.16,-282.42,21.93"
  },
  EPSG_4613: {
    towgs84: "-404.78,685.68,45.47"
  },
  EPSG_4607: {
    towgs84: "195.671,332.517,274.607"
  },
  EPSG_4475: {
    towgs84: "-381.788,-57.501,-256.673"
  },
  EPSG_4208: {
    towgs84: "-157.84,308.54,-146.6"
  },
  EPSG_4743: {
    towgs84: "70.995,-335.916,262.898"
  },
  EPSG_4710: {
    towgs84: "-323.65,551.39,-491.22"
  },
  EPSG_7881: {
    towgs84: "-0.077,0.079,0.086"
  },
  EPSG_4682: {
    towgs84: "283.729,735.942,261.143"
  },
  EPSG_4739: {
    towgs84: "-156,-271,-189"
  },
  EPSG_4679: {
    towgs84: "-80.01,253.26,291.19"
  },
  EPSG_4750: {
    towgs84: "-56.263,16.136,-22.856"
  },
  EPSG_4644: {
    towgs84: "-10.18,-350.43,291.37"
  },
  EPSG_4695: {
    towgs84: "-103.746,-9.614,-255.95"
  },
  EPSG_4292: {
    towgs84: "-355,21,72"
  },
  EPSG_4302: {
    towgs84: "-61.702,284.488,472.052"
  },
  EPSG_4143: {
    towgs84: "-124.76,53,466.79"
  },
  EPSG_4606: {
    towgs84: "-153,153,307"
  },
  EPSG_4699: {
    towgs84: "-770.1,158.4,-498.2"
  },
  EPSG_4247: {
    towgs84: "-273.5,110.6,-357.9"
  },
  EPSG_4160: {
    towgs84: "8.88,184.86,106.69"
  },
  EPSG_4161: {
    towgs84: "-233.43,6.65,173.64"
  },
  EPSG_9251: {
    towgs84: "-9.5,122.9,138.2"
  },
  EPSG_9253: {
    towgs84: "-78.1,101.6,133.3"
  },
  EPSG_4297: {
    towgs84: "-198.383,-240.517,-107.909"
  },
  EPSG_4269: {
    towgs84: "0,0,0"
  },
  EPSG_4301: {
    towgs84: "-147,506,687"
  },
  EPSG_4618: {
    towgs84: "-59,-11,-52"
  },
  EPSG_4612: {
    towgs84: "0,0,0"
  },
  EPSG_4678: {
    towgs84: "44.585,-131.212,-39.544"
  },
  EPSG_4250: {
    towgs84: "-130,29,364"
  },
  EPSG_4144: {
    towgs84: "214,804,268"
  },
  EPSG_4147: {
    towgs84: "-17.51,-108.32,-62.39"
  },
  EPSG_4259: {
    towgs84: "-254.1,-5.36,-100.29"
  },
  EPSG_4164: {
    towgs84: "-76,-138,67"
  },
  EPSG_4211: {
    towgs84: "-378.873,676.002,-46.255"
  },
  EPSG_4182: {
    towgs84: "-422.651,-172.995,84.02"
  },
  EPSG_4224: {
    towgs84: "-143.87,243.37,-33.52"
  },
  EPSG_4225: {
    towgs84: "-205.57,168.77,-4.12"
  },
  EPSG_5527: {
    towgs84: "-67.35,3.88,-38.22"
  },
  EPSG_4752: {
    towgs84: "98,390,-22"
  },
  EPSG_4310: {
    towgs84: "-30,190,89"
  },
  EPSG_9248: {
    towgs84: "-192.26,65.72,132.08"
  },
  EPSG_4680: {
    towgs84: "124.5,-63.5,-281"
  },
  EPSG_4701: {
    towgs84: "-79.9,-158,-168.9"
  },
  EPSG_4706: {
    towgs84: "-146.21,112.63,4.05"
  },
  EPSG_4805: {
    towgs84: "682,-203,480"
  },
  EPSG_4201: {
    towgs84: "-165,-11,206"
  },
  EPSG_4210: {
    towgs84: "-157,-2,-299"
  },
  EPSG_4183: {
    towgs84: "-104,167,-38"
  },
  EPSG_4139: {
    towgs84: "11,72,-101"
  },
  EPSG_4668: {
    towgs84: "-86,-98,-119"
  },
  EPSG_4717: {
    towgs84: "-2,151,181"
  },
  EPSG_4732: {
    towgs84: "102,52,-38"
  },
  EPSG_4280: {
    towgs84: "-377,681,-50"
  },
  EPSG_4209: {
    towgs84: "-138,-105,-289"
  },
  EPSG_4261: {
    towgs84: "31,146,47"
  },
  EPSG_4658: {
    towgs84: "-73,46,-86"
  },
  EPSG_4721: {
    towgs84: "265.025,384.929,-194.046"
  },
  EPSG_4222: {
    towgs84: "-136,-108,-292"
  },
  EPSG_4601: {
    towgs84: "-255,-15,71"
  },
  EPSG_4602: {
    towgs84: "725,685,536"
  },
  EPSG_4603: {
    towgs84: "72,213.7,93"
  },
  EPSG_4605: {
    towgs84: "9,183,236"
  },
  EPSG_4621: {
    towgs84: "137,248,-430"
  },
  EPSG_4657: {
    towgs84: "-28,199,5"
  },
  EPSG_4316: {
    towgs84: "103.25,-100.4,-307.19"
  },
  EPSG_4642: {
    towgs84: "-13,-348,292"
  },
  EPSG_4698: {
    towgs84: "145,-187,103"
  },
  EPSG_4192: {
    towgs84: "-206.1,-174.7,-87.7"
  },
  EPSG_4311: {
    towgs84: "-265,120,-358"
  },
  EPSG_4135: {
    towgs84: "58,-283,-182"
  },
  ESRI_104138: {
    towgs84: "198,-226,-347"
  },
  EPSG_4245: {
    towgs84: "-11,851,5"
  },
  EPSG_4142: {
    towgs84: "-125,53,467"
  },
  EPSG_4213: {
    towgs84: "-106,-87,188"
  },
  EPSG_4253: {
    towgs84: "-133,-77,-51"
  },
  EPSG_4129: {
    towgs84: "-132,-110,-335"
  },
  EPSG_4713: {
    towgs84: "-77,-128,142"
  },
  EPSG_4239: {
    towgs84: "217,823,299"
  },
  EPSG_4146: {
    towgs84: "295,736,257"
  },
  EPSG_4155: {
    towgs84: "-83,37,124"
  },
  EPSG_4165: {
    towgs84: "-173,253,27"
  },
  EPSG_4672: {
    towgs84: "175,-38,113"
  },
  EPSG_4236: {
    towgs84: "-637,-549,-203"
  },
  EPSG_4251: {
    towgs84: "-90,40,88"
  },
  EPSG_4271: {
    towgs84: "-2,374,172"
  },
  EPSG_4175: {
    towgs84: "-88,4,101"
  },
  EPSG_4716: {
    towgs84: "298,-304,-375"
  },
  EPSG_4315: {
    towgs84: "-23,259,-9"
  },
  EPSG_4744: {
    towgs84: "-242.2,-144.9,370.3"
  },
  EPSG_4244: {
    towgs84: "-97,787,86"
  },
  EPSG_4293: {
    towgs84: "616,97,-251"
  },
  EPSG_4714: {
    towgs84: "-127,-769,472"
  },
  EPSG_4736: {
    towgs84: "260,12,-147"
  },
  EPSG_6883: {
    towgs84: "-235,-110,393"
  },
  EPSG_6894: {
    towgs84: "-63,176,185"
  },
  EPSG_4205: {
    towgs84: "-43,-163,45"
  },
  EPSG_4256: {
    towgs84: "41,-220,-134"
  },
  EPSG_4262: {
    towgs84: "639,405,60"
  },
  EPSG_4604: {
    towgs84: "174,359,365"
  },
  EPSG_4169: {
    towgs84: "-115,118,426"
  },
  EPSG_4620: {
    towgs84: "-106,-129,165"
  },
  EPSG_4184: {
    towgs84: "-203,141,53"
  },
  EPSG_4616: {
    towgs84: "-289,-124,60"
  },
  EPSG_9403: {
    towgs84: "-307,-92,127"
  },
  EPSG_4684: {
    towgs84: "-133,-321,50"
  },
  EPSG_4708: {
    towgs84: "-491,-22,435"
  },
  EPSG_4707: {
    towgs84: "114,-116,-333"
  },
  EPSG_4709: {
    towgs84: "145,75,-272"
  },
  EPSG_4712: {
    towgs84: "-205,107,53"
  },
  EPSG_4711: {
    towgs84: "124,-234,-25"
  },
  EPSG_4718: {
    towgs84: "230,-199,-752"
  },
  EPSG_4719: {
    towgs84: "211,147,111"
  },
  EPSG_4724: {
    towgs84: "208,-435,-229"
  },
  EPSG_4725: {
    towgs84: "189,-79,-202"
  },
  EPSG_4735: {
    towgs84: "647,1777,-1124"
  },
  EPSG_4722: {
    towgs84: "-794,119,-298"
  },
  EPSG_4728: {
    towgs84: "-307,-92,127"
  },
  EPSG_4734: {
    towgs84: "-632,438,-609"
  },
  EPSG_4727: {
    towgs84: "912,-58,1227"
  },
  EPSG_4729: {
    towgs84: "185,165,42"
  },
  EPSG_4730: {
    towgs84: "170,42,84"
  },
  EPSG_4733: {
    towgs84: "276,-57,149"
  },
  ESRI_37218: {
    towgs84: "230,-199,-752"
  },
  ESRI_37240: {
    towgs84: "-7,215,225"
  },
  ESRI_37221: {
    towgs84: "252,-209,-751"
  },
  ESRI_4305: {
    towgs84: "-123,-206,219"
  },
  ESRI_104139: {
    towgs84: "-73,-247,227"
  },
  EPSG_4748: {
    towgs84: "51,391,-36"
  },
  EPSG_4219: {
    towgs84: "-384,664,-48"
  },
  EPSG_4255: {
    towgs84: "-333,-222,114"
  },
  EPSG_4257: {
    towgs84: "-587.8,519.75,145.76"
  },
  EPSG_4646: {
    towgs84: "-963,510,-359"
  },
  EPSG_6881: {
    towgs84: "-24,-203,268"
  },
  EPSG_6882: {
    towgs84: "-183,-15,273"
  },
  EPSG_4715: {
    towgs84: "-104,-129,239"
  },
  IGNF_RGF93GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGM04GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGSPM06GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGTAAF07GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGFG95GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGNCG: {
    towgs84: "0,0,0"
  },
  IGNF_RGPFGDD: {
    towgs84: "0,0,0"
  },
  IGNF_ETRS89G: {
    towgs84: "0,0,0"
  },
  IGNF_RGR92GDD: {
    towgs84: "0,0,0"
  },
  EPSG_4173: {
    towgs84: "0,0,0"
  },
  EPSG_4180: {
    towgs84: "0,0,0"
  },
  EPSG_4619: {
    towgs84: "0,0,0"
  },
  EPSG_4667: {
    towgs84: "0,0,0"
  },
  EPSG_4075: {
    towgs84: "0,0,0"
  },
  EPSG_6706: {
    towgs84: "0,0,0"
  },
  EPSG_7798: {
    towgs84: "0,0,0"
  },
  EPSG_4661: {
    towgs84: "0,0,0"
  },
  EPSG_4669: {
    towgs84: "0,0,0"
  },
  EPSG_8685: {
    towgs84: "0,0,0"
  },
  EPSG_4151: {
    towgs84: "0,0,0"
  },
  EPSG_9702: {
    towgs84: "0,0,0"
  },
  EPSG_4758: {
    towgs84: "0,0,0"
  },
  EPSG_4761: {
    towgs84: "0,0,0"
  },
  EPSG_4765: {
    towgs84: "0,0,0"
  },
  EPSG_8997: {
    towgs84: "0,0,0"
  },
  EPSG_4023: {
    towgs84: "0,0,0"
  },
  EPSG_4670: {
    towgs84: "0,0,0"
  },
  EPSG_4694: {
    towgs84: "0,0,0"
  },
  EPSG_4148: {
    towgs84: "0,0,0"
  },
  EPSG_4163: {
    towgs84: "0,0,0"
  },
  EPSG_4167: {
    towgs84: "0,0,0"
  },
  EPSG_4189: {
    towgs84: "0,0,0"
  },
  EPSG_4190: {
    towgs84: "0,0,0"
  },
  EPSG_4176: {
    towgs84: "0,0,0"
  },
  EPSG_4659: {
    towgs84: "0,0,0"
  },
  EPSG_3824: {
    towgs84: "0,0,0"
  },
  EPSG_3889: {
    towgs84: "0,0,0"
  },
  EPSG_4046: {
    towgs84: "0,0,0"
  },
  EPSG_4081: {
    towgs84: "0,0,0"
  },
  EPSG_4558: {
    towgs84: "0,0,0"
  },
  EPSG_4483: {
    towgs84: "0,0,0"
  },
  EPSG_5013: {
    towgs84: "0,0,0"
  },
  EPSG_5264: {
    towgs84: "0,0,0"
  },
  EPSG_5324: {
    towgs84: "0,0,0"
  },
  EPSG_5354: {
    towgs84: "0,0,0"
  },
  EPSG_5371: {
    towgs84: "0,0,0"
  },
  EPSG_5373: {
    towgs84: "0,0,0"
  },
  EPSG_5381: {
    towgs84: "0,0,0"
  },
  EPSG_5393: {
    towgs84: "0,0,0"
  },
  EPSG_5489: {
    towgs84: "0,0,0"
  },
  EPSG_5593: {
    towgs84: "0,0,0"
  },
  EPSG_6135: {
    towgs84: "0,0,0"
  },
  EPSG_6365: {
    towgs84: "0,0,0"
  },
  EPSG_5246: {
    towgs84: "0,0,0"
  },
  EPSG_7886: {
    towgs84: "0,0,0"
  },
  EPSG_8431: {
    towgs84: "0,0,0"
  },
  EPSG_8427: {
    towgs84: "0,0,0"
  },
  EPSG_8699: {
    towgs84: "0,0,0"
  },
  EPSG_8818: {
    towgs84: "0,0,0"
  },
  EPSG_4757: {
    towgs84: "0,0,0"
  },
  EPSG_9140: {
    towgs84: "0,0,0"
  },
  EPSG_8086: {
    towgs84: "0,0,0"
  },
  EPSG_4686: {
    towgs84: "0,0,0"
  },
  EPSG_4737: {
    towgs84: "0,0,0"
  },
  EPSG_4702: {
    towgs84: "0,0,0"
  },
  EPSG_4747: {
    towgs84: "0,0,0"
  },
  EPSG_4749: {
    towgs84: "0,0,0"
  },
  EPSG_4674: {
    towgs84: "0,0,0"
  },
  EPSG_4755: {
    towgs84: "0,0,0"
  },
  EPSG_4759: {
    towgs84: "0,0,0"
  },
  EPSG_4762: {
    towgs84: "0,0,0"
  },
  EPSG_4763: {
    towgs84: "0,0,0"
  },
  EPSG_4764: {
    towgs84: "0,0,0"
  },
  EPSG_4166: {
    towgs84: "0,0,0"
  },
  EPSG_4170: {
    towgs84: "0,0,0"
  },
  EPSG_5546: {
    towgs84: "0,0,0"
  },
  EPSG_7844: {
    towgs84: "0,0,0"
  },
  EPSG_4818: {
    towgs84: "589,76,480"
  },
  EPSG_10328: {
    towgs84: "0,0,0"
  },
  EPSG_9782: {
    towgs84: "0,0,0"
  },
  EPSG_9777: {
    towgs84: "0,0,0"
  },
  EPSG_10690: {
    towgs84: "0,0,0"
  },
  EPSG_10639: {
    towgs84: "0,0,0"
  },
  EPSG_10739: {
    towgs84: "0,0,0"
  },
  EPSG_7686: {
    towgs84: "0,0,0"
  },
  EPSG_8900: {
    towgs84: "0,0,0"
  },
  EPSG_5886: {
    towgs84: "0,0,0"
  },
  EPSG_7683: {
    towgs84: "0,0,0"
  },
  EPSG_6668: {
    towgs84: "0,0,0"
  },
  EPSG_20046: {
    towgs84: "0,0,0"
  },
  EPSG_10299: {
    towgs84: "0,0,0"
  },
  EPSG_10310: {
    towgs84: "0,0,0"
  },
  EPSG_10475: {
    towgs84: "0,0,0"
  },
  EPSG_4742: {
    towgs84: "0,0,0"
  },
  EPSG_10671: {
    towgs84: "0,0,0"
  },
  EPSG_10762: {
    towgs84: "0,0,0"
  },
  EPSG_10725: {
    towgs84: "0,0,0"
  },
  EPSG_10791: {
    towgs84: "0,0,0"
  },
  EPSG_10800: {
    towgs84: "0,0,0"
  },
  EPSG_10305: {
    towgs84: "0,0,0"
  },
  EPSG_10941: {
    towgs84: "0,0,0"
  },
  EPSG_10968: {
    towgs84: "0,0,0"
  },
  EPSG_10875: {
    towgs84: "0,0,0"
  },
  EPSG_6318: {
    towgs84: "0,0,0"
  },
  EPSG_10910: {
    towgs84: "0,0,0"
  }
};
for (var ns in Ut) {
  var Jt = Ut[ns];
  Jt.datumName && (Ut[Jt.datumName] = Jt);
}
function os(t, i, a, s, e, r, n) {
  var h = {};
  return h.datum_type = ti, i && (h.datum_type = ya, h.datum_params = i.map(parseFloat), (h.datum_params[0] !== 0 || h.datum_params[1] !== 0 || h.datum_params[2] !== 0) && (h.datum_type = it), h.datum_params.length > 3 && (h.datum_params[3] !== 0 || h.datum_params[4] !== 0 || h.datum_params[5] !== 0 || h.datum_params[6] !== 0) && (h.datum_type = at, h.datum_params[3] *= yt, h.datum_params[4] *= yt, h.datum_params[5] *= yt, h.datum_params[6] = h.datum_params[6] / 1e6 + 1)), n && (h.datum_type = ft, h.grids = n), h.a = a, h.b = s, h.es = e, h.ep2 = r, h;
}
var li = {};
function ls(t, i, a) {
  return i instanceof ArrayBuffer ? fs(t, i, a) : { ready: cs(t, i) };
}
function fs(t, i, a) {
  var s = !0;
  a !== void 0 && a.includeErrorFields === !1 && (s = !1);
  var e = new DataView(i), r = Ms(e), n = gs(e, r), h = vs(e, n, r, s), o = { header: n, subgrids: h };
  return li[t] = o, o;
}
async function cs(t, i) {
  for (var a = [], s = await i.getImageCount(), e = s - 1; e >= 0; e--) {
    var r = await i.getImage(e), n = await r.readRasters(), h = n, o = [r.getWidth(), r.getHeight()], l = r.getBoundingBox().map(Ii), _ = typeof r.fileDirectory.getValue == "function" ? r.fileDirectory.getValue("ModelPixelScale") : (
      /** @type {any} */
      r.fileDirectory.ModelPixelScale
    ), f = [_[0], _[1]].map(Ii), u = l[0] + (o[0] - 1) * f[0], g = l[3] - (o[1] - 1) * f[1], M = h[0], c = h[1], v = [];
    for (let w = o[1] - 1; w >= 0; w--)
      for (let P = o[0] - 1; P >= 0; P--) {
        var E = w * o[0] + P;
        v.push([-V(c[E]), V(M[E])]);
      }
    a.push({
      del: f,
      lim: o,
      ll: [-u, g],
      cvs: v
    });
  }
  var S = {
    header: {
      nSubgrids: s
    },
    subgrids: a
  };
  return li[t] = S, S;
}
function _s(t) {
  if (t === void 0)
    return null;
  var i = t.split(",");
  return i.map(us);
}
function us(t) {
  if (t.length === 0)
    return null;
  var i = t[0] === "@";
  return i && (t = t.slice(1)), t === "null" ? { name: "null", mandatory: !i, grid: null, isNull: !0 } : {
    name: t,
    mandatory: !i,
    grid: li[t] || null,
    isNull: !1
  };
}
function Ii(t) {
  return t * Math.PI / 180;
}
function V(t) {
  return t / 3600 * Math.PI / 180;
}
function Ms(t) {
  var i = t.getInt32(8, !1);
  return i === 11 ? !1 : (i = t.getInt32(8, !0), i !== 11 && console.warn("Failed to detect nadgrid endian-ness, defaulting to little-endian"), !0);
}
function gs(t, i) {
  return {
    nFields: t.getInt32(8, i),
    nSubgridFields: t.getInt32(24, i),
    nSubgrids: t.getInt32(40, i),
    shiftType: si(t, 56, 64).trim(),
    fromSemiMajorAxis: t.getFloat64(120, i),
    fromSemiMinorAxis: t.getFloat64(136, i),
    toSemiMajorAxis: t.getFloat64(152, i),
    toSemiMinorAxis: t.getFloat64(168, i)
  };
}
function si(t, i, a) {
  return String.fromCharCode.apply(null, new Uint8Array(t.buffer.slice(i, a)));
}
function vs(t, i, a, s) {
  for (var e = 176, r = [], n = 0; n < i.nSubgrids; n++) {
    var h = ms(t, e, a), o = ys(t, e, h, a, s), l = Math.round(
      1 + (h.upperLongitude - h.lowerLongitude) / h.longitudeInterval
    ), _ = Math.round(
      1 + (h.upperLatitude - h.lowerLatitude) / h.latitudeInterval
    );
    r.push({
      ll: [V(h.lowerLongitude), V(h.lowerLatitude)],
      del: [V(h.longitudeInterval), V(h.latitudeInterval)],
      lim: [l, _],
      count: h.gridNodeCount,
      cvs: ds(o)
    });
    var f = 16;
    s === !1 && (f = 8), e += 176 + h.gridNodeCount * f;
  }
  return r;
}
function ds(t) {
  return t.map(function(i) {
    return [V(i.longitudeShift), V(i.latitudeShift)];
  });
}
function ms(t, i, a) {
  return {
    name: si(t, i + 8, i + 16).trim(),
    parent: si(t, i + 24, i + 24 + 8).trim(),
    lowerLatitude: t.getFloat64(i + 72, a),
    upperLatitude: t.getFloat64(i + 88, a),
    lowerLongitude: t.getFloat64(i + 104, a),
    upperLongitude: t.getFloat64(i + 120, a),
    latitudeInterval: t.getFloat64(i + 136, a),
    longitudeInterval: t.getFloat64(i + 152, a),
    gridNodeCount: t.getInt32(i + 168, a)
  };
}
function ys(t, i, a, s, e) {
  var r = i + 176, n = 16;
  e === !1 && (n = 8);
  for (var h = [], o = 0; o < a.gridNodeCount; o++) {
    var l = {
      latitudeShift: t.getFloat32(r + o * n, s),
      longitudeShift: t.getFloat32(r + o * n + 4, s)
    };
    e !== !1 && (l.latitudeAccuracy = t.getFloat32(r + o * n + 8, s), l.longitudeAccuracy = t.getFloat32(r + o * n + 12, s)), h.push(l);
  }
  return h;
}
function B(t, i) {
  if (!(this instanceof B))
    return new B(t);
  this.forward = null, this.inverse = null, this.init = null, this.name, this.axis, this.names = null, this.title, i = i || function(l) {
    if (l)
      throw l;
  };
  var a = Ha(t);
  if (typeof a != "object") {
    i("Could not parse to valid json: " + t);
    return;
  }
  var s = B.projections.get(a.projName);
  if (!s) {
    i("Could not get projection name from: " + t);
    return;
  }
  if (a.datumCode && a.datumCode !== "none") {
    var e = X(Ut, a.datumCode);
    e && (a.datum_params = a.datum_params || (e.towgs84 ? e.towgs84.split(",") : null), a.ellps = e.ellipse, a.datumName = e.datumName ? e.datumName : a.datumCode);
  }
  a.axis = a.axis || "enu", a.ellps = a.ellps || "wgs84", a.lat1 = a.lat1 || a.lat0;
  var r = hs(a.a, a.b, a.rf, a.ellps, a.sphere), n = rs(r.a, r.b, r.rf, a.R_A), h = _s(a.nadgrids), o = a.datum || os(
    a.datumCode,
    a.datum_params,
    r.a,
    r.b,
    n.es,
    n.ep2,
    h
  );
  Ai(this, a), Ai(this, s), this.a = r.a, this.b = r.b, this.rf = r.rf, this.sphere = r.sphere, this.es = n.es, this.e = n.e, this.ep2 = n.ep2, this.datum = o, "init" in this && typeof this.init == "function" && this.init(), this.k0 || (this.k0 = 1), i(null, this);
}
B.projections = ss;
B.projections.start();
function Es(t, i) {
  return t.datum_type !== i.datum_type || t.a !== i.a || Math.abs(t.es - i.es) > 5e-11 ? !1 : t.datum_type === it ? t.datum_params[0] === i.datum_params[0] && t.datum_params[1] === i.datum_params[1] && t.datum_params[2] === i.datum_params[2] : t.datum_type === at ? t.datum_params[0] === i.datum_params[0] && t.datum_params[1] === i.datum_params[1] && t.datum_params[2] === i.datum_params[2] && t.datum_params[3] === i.datum_params[3] && t.datum_params[4] === i.datum_params[4] && t.datum_params[5] === i.datum_params[5] && t.datum_params[6] === i.datum_params[6] : !0;
}
function ia(t, i, a) {
  var s = t.x, e = t.y, r = t.z ? t.z : 0, n, h, o, l;
  if (e < -d && e > -1.001 * d)
    e = -d;
  else if (e > d && e < 1.001 * d)
    e = d;
  else {
    if (e < -d)
      return { x: -1 / 0, y: -1 / 0, z: t.z };
    if (e > d)
      return { x: 1 / 0, y: 1 / 0, z: t.z };
  }
  return s > Math.PI && (s -= 2 * Math.PI), h = Math.sin(e), l = Math.cos(e), o = h * h, n = a / Math.sqrt(1 - i * o), {
    x: (n + r) * l * Math.cos(s),
    y: (n + r) * l * Math.sin(s),
    z: (n * (1 - i) + r) * h
  };
}
function aa(t, i, a, s) {
  var e = 1e-12, r = e * e, n = 30, h, o, l, _, f, u, g, M, c, v, E, S, w, P = t.x, G = t.y, x = t.z ? t.z : 0, N, O, T;
  if (h = Math.sqrt(P * P + G * G), o = Math.sqrt(P * P + G * G + x * x), h / a < e) {
    if (N = 0, o / a < e)
      return O = d, T = -s, {
        x: t.x,
        y: t.y,
        z: t.z
      };
  } else
    N = Math.atan2(G, P);
  l = x / o, _ = h / o, f = 1 / Math.sqrt(1 - i * (2 - i) * _ * _), M = _ * (1 - i) * f, c = l * f, w = 0;
  do
    w++, g = a / Math.sqrt(1 - i * c * c), T = h * M + x * c - g * (1 - i * c * c), u = i * g / (g + T), f = 1 / Math.sqrt(1 - u * (2 - u) * _ * _), v = _ * (1 - u) * f, E = l * f, S = E * M - v * c, M = v, c = E;
  while (S * S > r && w < n);
  return O = Math.atan(E / Math.abs(v)), {
    x: N,
    y: O,
    z: T
  };
}
function Ss(t, i, a) {
  if (i === it)
    return {
      x: t.x + a[0],
      y: t.y + a[1],
      z: t.z + a[2]
    };
  if (i === at) {
    var s = a[0], e = a[1], r = a[2], n = a[3], h = a[4], o = a[5], l = a[6];
    return {
      x: l * (t.x - o * t.y + h * t.z) + s,
      y: l * (o * t.x + t.y - n * t.z) + e,
      z: l * (-h * t.x + n * t.y + t.z) + r
    };
  }
}
function ws(t, i, a) {
  if (i === it)
    return {
      x: t.x - a[0],
      y: t.y - a[1],
      z: t.z - a[2]
    };
  if (i === at) {
    var s = a[0], e = a[1], r = a[2], n = a[3], h = a[4], o = a[5], l = a[6], _ = (t.x - s) / l, f = (t.y - e) / l, u = (t.z - r) / l;
    return {
      x: _ + o * f - h * u,
      y: -o * _ + f + n * u,
      z: h * _ - n * f + u
    };
  }
}
function Ot(t) {
  return t === it || t === at;
}
function Ps(t, i, a) {
  if (Es(t, i) || t.datum_type === ti || i.datum_type === ti)
    return a;
  var s = t.a, e = t.es;
  if (t.datum_type === ft) {
    var r = Ci(t, !1, a);
    if (r !== 0)
      return;
    s = yi, e = Ei;
  }
  var n = i.a, h = i.b, o = i.es;
  if (i.datum_type === ft && (n = yi, h = Ea, o = Ei), e === o && s === n && !Ot(t.datum_type) && !Ot(i.datum_type))
    return a;
  if (a = ia(a, e, s), Ot(t.datum_type) && (a = Ss(a, t.datum_type, t.datum_params)), Ot(i.datum_type) && (a = ws(a, i.datum_type, i.datum_params)), a = aa(a, o, n, h), i.datum_type === ft) {
    var l = Ci(i, !0, a);
    if (l !== 0)
      return;
  }
  return a;
}
function Ci(t, i, a) {
  if (t.grids === null || t.grids.length === 0)
    return console.log("Grid shift grids not found"), -1;
  var s = { x: -a.x, y: a.y }, e = { x: Number.NaN, y: Number.NaN }, r = [];
  t:
    for (var n = 0; n < t.grids.length; n++) {
      var h = t.grids[n];
      if (r.push(h.name), h.isNull) {
        e = s;
        break;
      }
      if (h.grid === null) {
        if (h.mandatory)
          return console.log("Unable to find mandatory grid '" + h.name + "'"), -1;
        continue;
      }
      for (var o = h.grid.subgrids, l = 0, _ = o.length; l < _; l++) {
        var f = o[l], u = (Math.abs(f.del[1]) + Math.abs(f.del[0])) / 1e4, g = f.ll[0] - u, M = f.ll[1] - u, c = f.ll[0] + (f.lim[0] - 1) * f.del[0] + u, v = f.ll[1] + (f.lim[1] - 1) * f.del[1] + u;
        if (!(M > s.y || g > s.x || v < s.y || c < s.x) && (e = Gs(s, i, f), !isNaN(e.x)))
          break t;
      }
    }
  return isNaN(e.x) ? (console.log("Failed to find a grid shift table for location '" + -s.x * k + " " + s.y * k + " tried: '" + r + "'"), -1) : (a.x = -e.x, a.y = e.y, 0);
}
function Gs(t, i, a) {
  var s = { x: Number.NaN, y: Number.NaN };
  if (isNaN(t.x))
    return s;
  var e = { x: t.x, y: t.y };
  e.x -= a.ll[0], e.y -= a.ll[1], e.x = y(e.x - Math.PI) + Math.PI;
  var r = Ri(e, a);
  if (i) {
    if (isNaN(r.x))
      return s;
    r.x = e.x - r.x, r.y = e.y - r.y;
    var n = 9, h = 1e-12, o, l;
    do {
      if (l = Ri(r, a), isNaN(l.x)) {
        console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");
        break;
      }
      o = { x: e.x - (l.x + r.x), y: e.y - (l.y + r.y) }, r.x += o.x, r.y += o.y;
    } while (n-- && Math.abs(o.x) > h && Math.abs(o.y) > h);
    if (n < 0)
      return console.log("Inverse grid shift iterator failed to converge."), s;
    s.x = y(r.x + a.ll[0]), s.y = r.y + a.ll[1];
  } else
    isNaN(r.x) || (s.x = t.x + r.x, s.y = t.y + r.y);
  return s;
}
function Ri(t, i) {
  var a = { x: t.x / i.del[0], y: t.y / i.del[1] }, s = { x: Math.floor(a.x), y: Math.floor(a.y) }, e = { x: a.x - 1 * s.x, y: a.y - 1 * s.y }, r = { x: Number.NaN, y: Number.NaN }, n;
  if (s.x < 0 || s.x >= i.lim[0] || s.y < 0 || s.y >= i.lim[1])
    return r;
  n = s.y * i.lim[0] + s.x;
  var h = { x: i.cvs[n][0], y: i.cvs[n][1] };
  n++;
  var o = { x: i.cvs[n][0], y: i.cvs[n][1] };
  n += i.lim[0];
  var l = { x: i.cvs[n][0], y: i.cvs[n][1] };
  n--;
  var _ = { x: i.cvs[n][0], y: i.cvs[n][1] }, f = e.x * e.y, u = e.x * (1 - e.y), g = (1 - e.x) * (1 - e.y), M = (1 - e.x) * e.y;
  return r.x = g * h.x + u * o.x + M * _.x + f * l.x, r.y = g * h.y + u * o.y + M * _.y + f * l.y, r;
}
var tt = ["x", "y", "z"];
function xs(t, i) {
  const a = {};
  for (let s = 0, e = t.axis.length; s < e; s++) {
    if (s === 2 && i.z === void 0)
      continue;
    let r = i[tt[s]];
    switch (t.axis[s]) {
      case "e":
        a.x = r;
        break;
      case "w":
        a.x = -r;
        break;
      case "n":
        a.y = r;
        break;
      case "s":
        a.y = -r;
        break;
      case "u":
        a.z = r;
        break;
      case "d":
        a.z = -r;
        break;
      default:
        return null;
    }
  }
  return a;
}
function bs(t, i) {
  const a = (
    /** @type {import("./core").InterfaceCoordinates} */
    {}
  );
  for (let s = 0, e = t.axis.length; s < e; s++)
    if (!(s === 2 && i.z === void 0))
      switch (t.axis[s]) {
        case "e":
          a[tt[s]] = i.x;
          break;
        case "w":
          a[tt[s]] = -i.x;
          break;
        case "n":
          a[tt[s]] = i.y;
          break;
        case "s":
          a[tt[s]] = -i.y;
          break;
        case "u":
          a[tt[s]] = i.z;
          break;
        case "d":
          a[tt[s]] = -i.z;
          break;
        default:
          return null;
      }
  return a;
}
function fi(t) {
  var i = {
    x: t[0],
    y: t[1]
  };
  return t.length > 2 && (i.z = t[2]), t.length > 3 && (i.m = t[3]), i;
}
function As(t) {
  Ti(t.x), Ti(t.y);
}
function Ti(t) {
  if (typeof Number.isFinite == "function") {
    if (Number.isFinite(t))
      return;
    throw new TypeError("coordinates must be finite numbers");
  }
  if (typeof t != "number" || t !== t || !isFinite(t))
    throw new TypeError("coordinates must be finite numbers");
}
function Ns(t, i) {
  return (t.datum.datum_type === it || t.datum.datum_type === at || t.datum.datum_type === ft) && i.datumCode !== "WGS84" || (i.datum.datum_type === it || i.datum.datum_type === at || i.datum.datum_type === ft) && t.datumCode !== "WGS84";
}
function Bt(t, i, a, s) {
  var e, r = a.z !== void 0;
  if (As(a), t.datum && i.datum && Ns(t, i) && (e = new B("WGS84"), a = Bt(t, e, a, s), t = e), s && t.axis !== "enu" && (a = xs(t, a)), t.projName === "longlat")
    a = {
      x: a.x * I,
      y: a.y * I,
      z: a.z || 0
    };
  else if (t.to_meter && (a = {
    x: a.x * t.to_meter,
    y: a.y * t.to_meter,
    z: a.z || 0
  }), a = t.inverse(a), !a)
    return;
  if (t.from_greenwich && (a.x += t.from_greenwich), a = Ps(t.datum, i.datum, a), !!a)
    return a = /** @type {import('./core').InterfaceCoordinates} */
    a, i.from_greenwich && (a = {
      x: a.x - i.from_greenwich,
      y: a.y,
      z: a.z || 0
    }), i.projName === "longlat" ? (i.long_wrap !== void 0 && (a.x = i.long_wrap + y(a.x - i.long_wrap)), a = {
      x: a.x * k,
      y: a.y * k,
      z: a.z || 0
    }) : (a = i.forward(a), i.to_meter && (a = {
      x: a.x / i.to_meter,
      y: a.y / i.to_meter,
      z: a.z || 0
    })), s && i.axis !== "enu" ? bs(i, a) : (a && !r && i.projName !== "geocent" && delete a.z, a);
}
function Is(t, i, a, s) {
  var e;
  return Array.isArray(a) ? e = fi(a) : e = { x: a.x, y: a.y, z: a.z, m: a.m }, Bt(t, i, e, s);
}
var pi = B("WGS84");
function Zt(t, i, a, s) {
  var e, r, n;
  return Array.isArray(a) ? (e = Bt(t, i, fi(a), s) || { x: NaN, y: NaN }, a.length > 2 ? (r = typeof t.name < "u" && t.name === "geocent" || typeof i.name < "u" && i.name === "geocent", r ? typeof e.z == "number" ? (
    /** @type {T} */
    [e.x, e.y, e.z].concat(a.slice(3))
  ) : (
    /** @type {T} */
    [e.x, e.y, a[2]].concat(a.slice(3))
  ) : s && typeof e.z == "number" ? (
    /** @type {T} */
    [e.x, e.y, e.z].concat(a.slice(3))
  ) : (
    /** @type {T} */
    [e.x, e.y].concat(a.slice(2))
  )) : (
    /** @type {T} */
    [e.x, e.y]
  )) : (e = Bt(t, i, { x: a.x, y: a.y, z: a.z, m: a.m }, s) || { x: NaN, y: NaN }, n = Object.keys(a), n.length === 2 || (r = typeof t.name < "u" && t.name === "geocent" || typeof i.name < "u" && i.name === "geocent", n.forEach(function(h) {
    h === "x" || h === "y" || h === "z" && (r || s) || (e[h] = a[h]);
  })), /** @type {T} */
  e);
}
function Lt(t) {
  return t instanceof B ? t : typeof t == "object" && "oProj" in t ? t.oProj : B(
    /** @type {string | PROJJSONDefinition} */
    t
  );
}
function Cs(t, i, a) {
  var s, e, r = !1, n;
  return typeof i > "u" ? (e = Lt(t), s = pi, r = !0) : (typeof /** @type {?} */
  i.x < "u" || Array.isArray(i)) && (a = /** @type {T} */
  /** @type {?} */
  i, e = Lt(t), s = pi, r = !0), s || (s = Lt(t)), e || (e = Lt(
    /** @type {string | PROJJSONDefinition | proj } */
    i
  )), a ? Zt(s, e, a) : (n = {
    /**
     * @template {TemplateCoordinates} T
     * @param {T} coords
     * @param {boolean=} enforceAxis
     * @returns {T}
     */
    forward: function(h, o) {
      return Zt(s, e, h, o);
    },
    /**
     * @template {TemplateCoordinates} T
     * @param {T} coords
     * @param {boolean=} enforceAxis
     * @returns {T}
     */
    inverse: function(h, o) {
      return Zt(e, s, h, o);
    }
  }, r && (n.oProj = e), n);
}
var Oi = 6, sa = "AJSAJS", ea = "AFAFAF", ot = 65, U = 73, z = 79, vt = 86, dt = 90;
const Rs = {
  forward: ra,
  inverse: Ts,
  toPoint: ha
};
function ra(t, i) {
  return i = i || 5, Ls(ps({
    lat: t[1],
    lon: t[0]
  }), i);
}
function Ts(t) {
  var i = ci(oa(t.toUpperCase()));
  return i.lat && i.lon ? [i.lon, i.lat, i.lon, i.lat] : [i.left, i.bottom, i.right, i.top];
}
function ha(t) {
  var i = ci(oa(t.toUpperCase()));
  return i.lat && i.lon ? [i.lon, i.lat] : [(i.left + i.right) / 2, (i.top + i.bottom) / 2];
}
function Yt(t) {
  return t * (Math.PI / 180);
}
function Li(t) {
  return 180 * (t / Math.PI);
}
function ps(t) {
  var i = t.lat, a = t.lon, s = 6378137, e = 669438e-8, r = 0.9996, n, h, o, l, _, f, u, g = Yt(i), M = Yt(a), c, v;
  v = Math.floor((a + 180) / 6) + 1, a === 180 && (v = 60), i >= 56 && i < 64 && a >= 3 && a < 12 && (v = 32), i >= 72 && i < 84 && (a >= 0 && a < 9 ? v = 31 : a >= 9 && a < 21 ? v = 33 : a >= 21 && a < 33 ? v = 35 : a >= 33 && a < 42 && (v = 37)), n = (v - 1) * 6 - 180 + 3, c = Yt(n), h = e / (1 - e), o = s / Math.sqrt(1 - e * Math.sin(g) * Math.sin(g)), l = Math.tan(g) * Math.tan(g), _ = h * Math.cos(g) * Math.cos(g), f = Math.cos(g) * (M - c), u = s * ((1 - e / 4 - 3 * e * e / 64 - 5 * e * e * e / 256) * g - (3 * e / 8 + 3 * e * e / 32 + 45 * e * e * e / 1024) * Math.sin(2 * g) + (15 * e * e / 256 + 45 * e * e * e / 1024) * Math.sin(4 * g) - 35 * e * e * e / 3072 * Math.sin(6 * g));
  var E = r * o * (f + (1 - l + _) * f * f * f / 6 + (5 - 18 * l + l * l + 72 * _ - 58 * h) * f * f * f * f * f / 120) + 5e5, S = r * (u + o * Math.tan(g) * (f * f / 2 + (5 - l + 9 * _ + 4 * _ * _) * f * f * f * f / 24 + (61 - 58 * l + l * l + 600 * _ - 330 * h) * f * f * f * f * f * f / 720));
  return i < 0 && (S += 1e7), {
    northing: Math.round(S),
    easting: Math.round(E),
    zoneNumber: v,
    zoneLetter: Os(i)
  };
}
function ci(t) {
  var i = t.northing, a = t.easting, s = t.zoneLetter, e = t.zoneNumber;
  if (e < 0 || e > 60)
    return null;
  var r = 0.9996, n = 6378137, h = 669438e-8, o, l = (1 - Math.sqrt(1 - h)) / (1 + Math.sqrt(1 - h)), _, f, u, g, M, c, v, E, S, w = a - 5e5, P = i;
  s < "N" && (P -= 1e7), v = (e - 1) * 6 - 180 + 3, o = h / (1 - h), c = P / r, E = c / (n * (1 - h / 4 - 3 * h * h / 64 - 5 * h * h * h / 256)), S = E + (3 * l / 2 - 27 * l * l * l / 32) * Math.sin(2 * E) + (21 * l * l / 16 - 55 * l * l * l * l / 32) * Math.sin(4 * E) + 151 * l * l * l / 96 * Math.sin(6 * E), _ = n / Math.sqrt(1 - h * Math.sin(S) * Math.sin(S)), f = Math.tan(S) * Math.tan(S), u = o * Math.cos(S) * Math.cos(S), g = n * (1 - h) / Math.pow(1 - h * Math.sin(S) * Math.sin(S), 1.5), M = w / (_ * r);
  var G = S - _ * Math.tan(S) / g * (M * M / 2 - (5 + 3 * f + 10 * u - 4 * u * u - 9 * o) * M * M * M * M / 24 + (61 + 90 * f + 298 * u + 45 * f * f - 252 * o - 3 * u * u) * M * M * M * M * M * M / 720);
  G = Li(G);
  var x = (M - (1 + 2 * f + u) * M * M * M / 6 + (5 - 2 * u + 28 * f - 3 * u * u + 8 * o + 24 * f * f) * M * M * M * M * M / 120) / Math.cos(S);
  x = v + Li(x);
  var N;
  if (t.accuracy) {
    var O = ci({
      northing: t.northing + t.accuracy,
      easting: t.easting + t.accuracy,
      zoneLetter: t.zoneLetter,
      zoneNumber: t.zoneNumber
    });
    N = {
      top: O.lat,
      right: O.lon,
      bottom: G,
      left: x
    };
  } else
    N = {
      lat: G,
      lon: x
    };
  return N;
}
function Os(t) {
  var i = "Z";
  return 84 >= t && t >= 72 ? i = "X" : 72 > t && t >= 64 ? i = "W" : 64 > t && t >= 56 ? i = "V" : 56 > t && t >= 48 ? i = "U" : 48 > t && t >= 40 ? i = "T" : 40 > t && t >= 32 ? i = "S" : 32 > t && t >= 24 ? i = "R" : 24 > t && t >= 16 ? i = "Q" : 16 > t && t >= 8 ? i = "P" : 8 > t && t >= 0 ? i = "N" : 0 > t && t >= -8 ? i = "M" : -8 > t && t >= -16 ? i = "L" : -16 > t && t >= -24 ? i = "K" : -24 > t && t >= -32 ? i = "J" : -32 > t && t >= -40 ? i = "H" : -40 > t && t >= -48 ? i = "G" : -48 > t && t >= -56 ? i = "F" : -56 > t && t >= -64 ? i = "E" : -64 > t && t >= -72 ? i = "D" : -72 > t && t >= -80 && (i = "C"), i;
}
function Ls(t, i) {
  var a = "00000" + t.easting, s = "00000" + t.northing;
  return t.zoneNumber + t.zoneLetter + qs(t.easting, t.northing, t.zoneNumber) + a.substr(a.length - 5, i) + s.substr(s.length - 5, i);
}
function qs(t, i, a) {
  var s = na(a), e = Math.floor(t / 1e5), r = Math.floor(i / 1e5) % 20;
  return Us(e, r, s);
}
function na(t) {
  var i = t % Oi;
  return i === 0 && (i = Oi), i;
}
function Us(t, i, a) {
  var s = a - 1, e = sa.charCodeAt(s), r = ea.charCodeAt(s), n = e + t - 1, h = r + i, o = !1;
  n > dt && (n = n - dt + ot - 1, o = !0), (n === U || e < U && n > U || (n > U || e < U) && o) && n++, (n === z || e < z && n > z || (n > z || e < z) && o) && (n++, n === U && n++), n > dt && (n = n - dt + ot - 1), h > vt ? (h = h - vt + ot - 1, o = !0) : o = !1, (h === U || r < U && h > U || (h > U || r < U) && o) && h++, (h === z || r < z && h > z || (h > z || r < z) && o) && (h++, h === U && h++), h > vt && (h = h - vt + ot - 1);
  var l = String.fromCharCode(n) + String.fromCharCode(h);
  return l;
}
function oa(t) {
  if (t && t.length === 0)
    throw "MGRSPoint coverting from nothing";
  for (var i = t.length, a = null, s = "", e, r = 0; !/[A-Z]/.test(e = t.charAt(r)); ) {
    if (r >= 2)
      throw "MGRSPoint bad conversion from: " + t;
    s += e, r++;
  }
  var n = parseInt(s, 10);
  if (r === 0 || r + 3 > i)
    throw "MGRSPoint bad conversion from: " + t;
  var h = t.charAt(r++);
  if (h <= "A" || h === "B" || h === "Y" || h >= "Z" || h === "I" || h === "O")
    throw "MGRSPoint zone letter " + h + " not handled: " + t;
  a = t.substring(r, r += 2);
  for (var o = na(n), l = Ds(a.charAt(0), o), _ = ks(a.charAt(1), o); _ < Fs(h); )
    _ += 2e6;
  var f = i - r;
  if (f % 2 !== 0)
    throw `MGRSPoint has to have an even number 
of digits after the zone letter and two 100km letters - front 
half for easting meters, second half for 
northing meters` + t;
  var u = f / 2, g = 0, M = 0, c, v, E, S, w;
  return u > 0 && (c = 1e5 / Math.pow(10, u), v = t.substring(r, r + u), g = parseFloat(v) * c, E = t.substring(r + u), M = parseFloat(E) * c), S = g + l, w = M + _, {
    easting: S,
    northing: w,
    zoneLetter: h,
    zoneNumber: n,
    accuracy: c
  };
}
function Ds(t, i) {
  for (var a = sa.charCodeAt(i - 1), s = 1e5, e = !1; a !== t.charCodeAt(0); ) {
    if (a++, a === U && a++, a === z && a++, a > dt) {
      if (e)
        throw "Bad character: " + t;
      a = ot, e = !0;
    }
    s += 1e5;
  }
  return s;
}
function ks(t, i) {
  if (t > "V")
    throw "MGRSPoint given invalid Northing " + t;
  for (var a = ea.charCodeAt(i - 1), s = 0, e = !1; a !== t.charCodeAt(0); ) {
    if (a++, a === U && a++, a === z && a++, a > vt) {
      if (e)
        throw "Bad character: " + t;
      a = ot, e = !0;
    }
    s += 1e5;
  }
  return s;
}
function Fs(t) {
  var i;
  switch (t) {
    case "C":
      i = 11e5;
      break;
    case "D":
      i = 2e6;
      break;
    case "E":
      i = 28e5;
      break;
    case "F":
      i = 37e5;
      break;
    case "G":
      i = 46e5;
      break;
    case "H":
      i = 55e5;
      break;
    case "J":
      i = 64e5;
      break;
    case "K":
      i = 73e5;
      break;
    case "L":
      i = 82e5;
      break;
    case "M":
      i = 91e5;
      break;
    case "N":
      i = 0;
      break;
    case "P":
      i = 8e5;
      break;
    case "Q":
      i = 17e5;
      break;
    case "R":
      i = 26e5;
      break;
    case "S":
      i = 35e5;
      break;
    case "T":
      i = 44e5;
      break;
    case "U":
      i = 53e5;
      break;
    case "V":
      i = 62e5;
      break;
    case "W":
      i = 7e6;
      break;
    case "X":
      i = 79e5;
      break;
    default:
      i = -1;
  }
  if (i >= 0)
    return i;
  throw "Invalid zone letter: " + t;
}
function ut(t, i, a) {
  if (!(this instanceof ut))
    return new ut(t, i, a);
  if (Array.isArray(t))
    this.x = t[0], this.y = t[1], this.z = t[2] || 0;
  else if (typeof t == "object")
    this.x = t.x, this.y = t.y, this.z = t.z || 0;
  else if (typeof t == "string" && typeof i > "u") {
    var s = t.split(",");
    this.x = parseFloat(s[0]), this.y = parseFloat(s[1]), this.z = parseFloat(s[2]) || 0;
  } else
    this.x = t, this.y = i, this.z = a || 0;
  console.warn("proj4.Point will be removed in version 3, use proj4.toPoint");
}
ut.fromMGRS = function(t) {
  return new ut(ha(t));
};
ut.prototype.toMGRS = function(t) {
  return ra([this.x, this.y], t);
};
var $s = 1, zs = 0.25, qi = 0.046875, Ui = 0.01953125, Di = 0.01068115234375, Bs = 0.75, js = 0.46875, Ws = 0.013020833333333334, Hs = 0.007120768229166667, Qs = 0.3645833333333333, Ks = 0.005696614583333333, Vs = 0.3076171875;
function _i(t) {
  var i = [];
  i[0] = $s - t * (zs + t * (qi + t * (Ui + t * Di))), i[1] = t * (Bs - t * (qi + t * (Ui + t * Di)));
  var a = t * t;
  return i[2] = a * (js - t * (Ws + t * Hs)), a *= t, i[3] = a * (Qs - t * Ks), i[4] = a * t * Vs, i;
}
function Mt(t, i, a, s) {
  return a *= i, i *= i, s[0] * t - a * (s[1] + i * (s[2] + i * (s[3] + i * s[4])));
}
var Xs = 20;
function ui(t, i, a) {
  for (var s = 1 / (1 - i), e = t, r = Xs; r; --r) {
    var n = Math.sin(e), h = 1 - i * n * n;
    if (h = (Mt(e, n, Math.cos(e), a) - t) * (h * Math.sqrt(h)) * s, e -= h, Math.abs(h) < m)
      return e;
  }
  return e;
}
function Js() {
  this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.es && (this.en = _i(this.es), this.ml0 = Mt(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en));
}
function Zs(t) {
  var i = t.x, a = t.y, s = y(i - this.long0, this.over), e, r, n, h = Math.sin(a), o = Math.cos(a);
  if (this.es) {
    var _ = o * s, f = Math.pow(_, 2), u = this.ep2 * Math.pow(o, 2), g = Math.pow(u, 2), M = Math.abs(o) > m ? Math.tan(a) : 0, c = Math.pow(M, 2), v = Math.pow(c, 2);
    e = 1 - this.es * Math.pow(h, 2), _ = _ / Math.sqrt(e);
    var E = Mt(a, h, o, this.en);
    r = this.a * (this.k0 * _ * (1 + f / 6 * (1 - c + u + f / 20 * (5 - 18 * c + v + 14 * u - 58 * c * u + f / 42 * (61 + 179 * v - v * c - 479 * c))))) + this.x0, n = this.a * (this.k0 * (E - this.ml0 + h * s * _ / 2 * (1 + f / 12 * (5 - c + 9 * u + 4 * g + f / 30 * (61 + v - 58 * c + 270 * u - 330 * c * u + f / 56 * (1385 + 543 * v - v * c - 3111 * c)))))) + this.y0;
  } else {
    var l = o * Math.sin(s);
    if (Math.abs(Math.abs(l) - 1) < m)
      return 93;
    if (r = 0.5 * this.a * this.k0 * Math.log((1 + l) / (1 - l)) + this.x0, n = o * Math.cos(s) / Math.sqrt(1 - Math.pow(l, 2)), l = Math.abs(n), l >= 1) {
      if (l - 1 > m)
        return 93;
      n = 0;
    } else
      n = Math.acos(n);
    a < 0 && (n = -n), n = this.a * this.k0 * (n - this.lat0) + this.y0;
  }
  return t.x = r, t.y = n, t;
}
function Ys(t) {
  var i, a, s, e, r = (t.x - this.x0) * (1 / this.a), n = (t.y - this.y0) * (1 / this.a);
  if (this.es)
    if (i = this.ml0 + n / this.k0, a = ui(i, this.es, this.en), Math.abs(a) < d) {
      var f = Math.sin(a), u = Math.cos(a), g = Math.abs(u) > m ? Math.tan(a) : 0, M = this.ep2 * Math.pow(u, 2), c = Math.pow(M, 2), v = Math.pow(g, 2), E = Math.pow(v, 2);
      i = 1 - this.es * Math.pow(f, 2);
      var S = r * Math.sqrt(i) / this.k0, w = Math.pow(S, 2);
      i = i * g, s = a - i * w / (1 - this.es) * 0.5 * (1 - w / 12 * (5 + 3 * v - 9 * M * v + M - 4 * c - w / 30 * (61 + 90 * v - 252 * M * v + 45 * E + 46 * M - w / 56 * (1385 + 3633 * v + 4095 * E + 1574 * E * v)))), e = y(this.long0 + S * (1 - w / 6 * (1 + 2 * v + M - w / 20 * (5 + 28 * v + 24 * E + 8 * M * v + 6 * M - w / 42 * (61 + 662 * v + 1320 * E + 720 * E * v)))) / u, this.over);
    } else
      s = d * It(n), e = 0;
  else {
    var h = Math.exp(r / this.k0), o = 0.5 * (h - 1 / h), l = this.lat0 + n / this.k0, _ = Math.cos(l);
    i = Math.sqrt((1 - Math.pow(_, 2)) / (1 + Math.pow(o, 2))), s = Math.asin(i), n < 0 && (s = -s), o === 0 && _ === 0 ? e = 0 : e = y(Math.atan2(o, _) + this.long0, this.over);
  }
  return t.x = e, t.y = s, t;
}
var te = ["Fast_Transverse_Mercator", "Fast Transverse Mercator"];
const Dt = {
  init: Js,
  forward: Zs,
  inverse: Ys,
  names: te
};
function la(t) {
  var i = Math.exp(t);
  return i = (i - 1 / i) / 2, i;
}
function D(t, i) {
  t = Math.abs(t), i = Math.abs(i);
  var a = Math.max(t, i), s = Math.min(t, i) / (a || 1);
  return a * Math.sqrt(1 + Math.pow(s, 2));
}
function ie(t) {
  var i = 1 + t, a = i - 1;
  return a === 0 ? t : t * Math.log(i) / a;
}
function ae(t) {
  var i = Math.abs(t);
  return i = ie(i * (1 + i / (D(1, i) + 1))), t < 0 ? -i : i;
}
function Mi(t, i) {
  for (var a = 2 * Math.cos(2 * i), s = t.length - 1, e = t[s], r = 0, n; --s >= 0; )
    n = -r + a * e + t[s], r = e, e = n;
  return i + n * Math.sin(2 * i);
}
function se(t, i) {
  for (var a = 2 * Math.cos(i), s = t.length - 1, e = t[s], r = 0, n; --s >= 0; )
    n = -r + a * e + t[s], r = e, e = n;
  return Math.sin(i) * n;
}
function ee(t) {
  var i = Math.exp(t);
  return i = (i + 1 / i) / 2, i;
}
function fa(t, i, a) {
  for (var s = Math.sin(i), e = Math.cos(i), r = la(a), n = ee(a), h = 2 * e * n, o = -2 * s * r, l = t.length - 1, _ = t[l], f = 0, u = 0, g = 0, M, c; --l >= 0; )
    M = u, c = f, u = _, f = g, _ = -M + h * u - o * f + t[l], g = -c + o * u + h * f;
  return h = s * n, o = e * r, [h * _ - o * g, h * g + o * _];
}
function re() {
  if (!this.approx && (isNaN(this.es) || this.es <= 0))
    throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
  this.approx && (Dt.init.apply(this), this.forward = Dt.forward, this.inverse = Dt.inverse), this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.k0 = this.k0 !== void 0 ? this.k0 : 1, this.cgb = [], this.cbg = [], this.utg = [], this.gtu = [];
  var t = this.es / (1 + Math.sqrt(1 - this.es)), i = t / (2 - t), a = i;
  this.cgb[0] = i * (2 + i * (-2 / 3 + i * (-2 + i * (116 / 45 + i * (26 / 45 + i * (-2854 / 675)))))), this.cbg[0] = i * (-2 + i * (2 / 3 + i * (4 / 3 + i * (-82 / 45 + i * (32 / 45 + i * (4642 / 4725)))))), a = a * i, this.cgb[1] = a * (7 / 3 + i * (-8 / 5 + i * (-227 / 45 + i * (2704 / 315 + i * (2323 / 945))))), this.cbg[1] = a * (5 / 3 + i * (-16 / 15 + i * (-13 / 9 + i * (904 / 315 + i * (-1522 / 945))))), a = a * i, this.cgb[2] = a * (56 / 15 + i * (-136 / 35 + i * (-1262 / 105 + i * (73814 / 2835)))), this.cbg[2] = a * (-26 / 15 + i * (34 / 21 + i * (8 / 5 + i * (-12686 / 2835)))), a = a * i, this.cgb[3] = a * (4279 / 630 + i * (-332 / 35 + i * (-399572 / 14175))), this.cbg[3] = a * (1237 / 630 + i * (-12 / 5 + i * (-24832 / 14175))), a = a * i, this.cgb[4] = a * (4174 / 315 + i * (-144838 / 6237)), this.cbg[4] = a * (-734 / 315 + i * (109598 / 31185)), a = a * i, this.cgb[5] = a * (601676 / 22275), this.cbg[5] = a * (444337 / 155925), a = Math.pow(i, 2), this.Qn = this.k0 / (1 + i) * (1 + a * (1 / 4 + a * (1 / 64 + a / 256))), this.utg[0] = i * (-0.5 + i * (2 / 3 + i * (-37 / 96 + i * (1 / 360 + i * (81 / 512 + i * (-96199 / 604800)))))), this.gtu[0] = i * (0.5 + i * (-2 / 3 + i * (5 / 16 + i * (41 / 180 + i * (-127 / 288 + i * (7891 / 37800)))))), this.utg[1] = a * (-1 / 48 + i * (-1 / 15 + i * (437 / 1440 + i * (-46 / 105 + i * (1118711 / 3870720))))), this.gtu[1] = a * (13 / 48 + i * (-3 / 5 + i * (557 / 1440 + i * (281 / 630 + i * (-1983433 / 1935360))))), a = a * i, this.utg[2] = a * (-17 / 480 + i * (37 / 840 + i * (209 / 4480 + i * (-5569 / 90720)))), this.gtu[2] = a * (61 / 240 + i * (-103 / 140 + i * (15061 / 26880 + i * (167603 / 181440)))), a = a * i, this.utg[3] = a * (-4397 / 161280 + i * (11 / 504 + i * (830251 / 7257600))), this.gtu[3] = a * (49561 / 161280 + i * (-179 / 168 + i * (6601661 / 7257600))), a = a * i, this.utg[4] = a * (-4583 / 161280 + i * (108847 / 3991680)), this.gtu[4] = a * (34729 / 80640 + i * (-3418889 / 1995840)), a = a * i, this.utg[5] = a * (-20648693 / 638668800), this.gtu[5] = a * (212378941 / 319334400);
  var s = Mi(this.cbg, this.lat0);
  this.Zb = -this.Qn * (s + se(this.gtu, 2 * s));
}
function he(t) {
  var i = y(t.x - this.long0, this.over), a = t.y;
  a = Mi(this.cbg, a);
  var s = Math.sin(a), e = Math.cos(a), r = Math.sin(i), n = Math.cos(i);
  a = Math.atan2(s, n * e), i = Math.atan2(r * e, D(s, e * n)), i = ae(Math.tan(i));
  var h = fa(this.gtu, 2 * a, 2 * i);
  a = a + h[0], i = i + h[1];
  var o, l;
  return Math.abs(i) <= 2.623395162778 ? (o = this.a * (this.Qn * i) + this.x0, l = this.a * (this.Qn * a + this.Zb) + this.y0) : (o = 1 / 0, l = 1 / 0), t.x = o, t.y = l, t;
}
function ne(t) {
  var i = (t.x - this.x0) * (1 / this.a), a = (t.y - this.y0) * (1 / this.a);
  a = (a - this.Zb) / this.Qn, i = i / this.Qn;
  var s, e;
  if (Math.abs(i) <= 2.623395162778) {
    var r = fa(this.utg, 2 * a, 2 * i);
    a = a + r[0], i = i + r[1], i = Math.atan(la(i));
    var n = Math.sin(a), h = Math.cos(a), o = Math.sin(i), l = Math.cos(i);
    a = Math.atan2(n * l, D(o, l * h)), i = Math.atan2(o, l * h), s = y(i + this.long0, this.over), e = Mi(this.cgb, a);
  } else
    s = 1 / 0, e = 1 / 0;
  return t.x = s, t.y = e, t;
}
var oe = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc", "Transverse_Mercator", "Transverse Mercator", "Gauss Kruger", "Gauss_Kruger", "tmerc"];
const kt = {
  init: re,
  forward: he,
  inverse: ne,
  names: oe
};
function le(t, i) {
  if (t === void 0) {
    if (t = Math.floor((y(i) + Math.PI) * 30 / Math.PI) + 1, t < 0)
      return 0;
    if (t > 60)
      return 60;
  }
  return t;
}
var fe = "etmerc";
function ce() {
  var t = le(this.zone, this.long0);
  if (t === void 0)
    throw new Error("unknown utm zone");
  this.lat0 = 0, this.long0 = (6 * Math.abs(t) - 183) * I, this.x0 = 5e5, this.y0 = this.utmSouth ? 1e7 : 0, this.k0 = 0.9996, kt.init.apply(this), this.forward = kt.forward, this.inverse = kt.inverse;
}
var _e = ["Universal Transverse Mercator System", "utm"];
const ue = {
  init: ce,
  names: _e,
  dependsOn: fe
};
function gi(t, i) {
  return Math.pow((1 - t) / (1 + t), i);
}
var Me = 20;
function ge() {
  var t = Math.sin(this.lat0), i = Math.cos(this.lat0);
  i *= i, this.rc = Math.sqrt(1 - this.es) / (1 - this.es * t * t), this.C = Math.sqrt(1 + this.es * i * i / (1 - this.es)), this.phic0 = Math.asin(t / this.C), this.ratexp = 0.5 * this.C * this.e, this.K = Math.tan(0.5 * this.phic0 + b) / (Math.pow(Math.tan(0.5 * this.lat0 + b), this.C) * gi(this.e * t, this.ratexp));
}
function ve(t) {
  var i = t.x, a = t.y;
  return t.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * a + b), this.C) * gi(this.e * Math.sin(a), this.ratexp)) - d, t.x = this.C * i, t;
}
function de(t) {
  for (var i = 1e-14, a = t.x / this.C, s = t.y, e = Math.pow(Math.tan(0.5 * s + b) / this.K, 1 / this.C), r = Me; r > 0 && (s = 2 * Math.atan(e * gi(this.e * Math.sin(t.y), -0.5 * this.e)) - d, !(Math.abs(s - t.y) < i)); --r)
    t.y = s;
  return r ? (t.x = a, t.y = s, t) : null;
}
const vi = {
  init: ge,
  forward: ve,
  inverse: de
};
function me() {
  vi.init.apply(this), this.rc && (this.sinc0 = Math.sin(this.phic0), this.cosc0 = Math.cos(this.phic0), this.R2 = 2 * this.rc, this.title || (this.title = "Oblique Stereographic Alternative"));
}
function ye(t) {
  var i, a, s, e;
  return t.x = y(t.x - this.long0, this.over), vi.forward.apply(this, [t]), i = Math.sin(t.y), a = Math.cos(t.y), s = Math.cos(t.x), e = this.k0 * this.R2 / (1 + this.sinc0 * i + this.cosc0 * a * s), t.x = e * a * Math.sin(t.x), t.y = e * (this.cosc0 * i - this.sinc0 * a * s), t.x = this.a * t.x + this.x0, t.y = this.a * t.y + this.y0, t;
}
function Ee(t) {
  var i, a, s, e, r;
  if (t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, t.x /= this.k0, t.y /= this.k0, r = D(t.x, t.y)) {
    var n = 2 * Math.atan2(r, this.R2);
    i = Math.sin(n), a = Math.cos(n), e = Math.asin(a * this.sinc0 + t.y * i * this.cosc0 / r), s = Math.atan2(t.x * i, r * this.cosc0 * a - t.y * this.sinc0 * i);
  } else
    e = this.phic0, s = 0;
  return t.x = s, t.y = e, vi.inverse.apply(this, [t]), t.x = y(t.x + this.long0, this.over), t;
}
var Se = ["Stereographic_North_Pole", "Oblique_Stereographic", "sterea", "Oblique Stereographic Alternative", "Double_Stereographic"];
const we = {
  init: me,
  forward: ye,
  inverse: Ee,
  names: Se
};
function di(t, i, a) {
  return i *= a, Math.tan(0.5 * (d + t)) * Math.pow((1 - i) / (1 + i), 0.5 * a);
}
function Pe() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.coslat0 = Math.cos(this.lat0), this.sinlat0 = Math.sin(this.lat0), this.sphere ? !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= m && (this.k0 = 0.5 * (1 + It(this.lat0) * Math.sin(this.lat_ts))) : (Math.abs(this.coslat0) <= m && (this.lat0 > 0 ? this.con = 1 : this.con = -1), this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e)), !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= m && Math.abs(Math.cos(this.lat_ts)) > m && (this.k0 = 0.5 * this.cons * H(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / j(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts))), this.ms1 = H(this.e, this.sinlat0, this.coslat0), this.X0 = 2 * Math.atan(di(this.lat0, this.sinlat0, this.e)) - d, this.cosX0 = Math.cos(this.X0), this.sinX0 = Math.sin(this.X0));
}
function Ge(t) {
  var i = t.x, a = t.y, s = Math.sin(a), e = Math.cos(a), r, n, h, o, l, _, f = y(i - this.long0, this.over);
  return Math.abs(Math.abs(i - this.long0) - Math.PI) <= m && Math.abs(a + this.lat0) <= m ? (t.x = NaN, t.y = NaN, t) : this.sphere ? (r = 2 * this.k0 / (1 + this.sinlat0 * s + this.coslat0 * e * Math.cos(f)), t.x = this.a * r * e * Math.sin(f) + this.x0, t.y = this.a * r * (this.coslat0 * s - this.sinlat0 * e * Math.cos(f)) + this.y0, t) : (n = 2 * Math.atan(di(a, s, this.e)) - d, o = Math.cos(n), h = Math.sin(n), Math.abs(this.coslat0) <= m ? (l = j(this.e, a * this.con, this.con * s), _ = 2 * this.a * this.k0 * l / this.cons, t.x = this.x0 + _ * Math.sin(i - this.long0), t.y = this.y0 - this.con * _ * Math.cos(i - this.long0), t) : (Math.abs(this.sinlat0) < m ? (r = 2 * this.a * this.k0 / (1 + o * Math.cos(f)), t.y = r * h) : (r = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * h + this.cosX0 * o * Math.cos(f))), t.y = r * (this.cosX0 * h - this.sinX0 * o * Math.cos(f)) + this.y0), t.x = r * o * Math.sin(f) + this.x0, t));
}
function xe(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i, a, s, e, r, n = Math.sqrt(t.x * t.x + t.y * t.y);
  if (this.sphere) {
    var h = 2 * Math.atan(n / (2 * this.a * this.k0));
    return i = this.long0, a = this.lat0, n <= m ? (t.x = i, t.y = a, t) : (a = Math.asin(Math.cos(h) * this.sinlat0 + t.y * Math.sin(h) * this.coslat0 / n), Math.abs(this.coslat0) < m ? this.lat0 > 0 ? i = y(this.long0 + Math.atan2(t.x, -1 * t.y), this.over) : i = y(this.long0 + Math.atan2(t.x, t.y), this.over) : i = y(this.long0 + Math.atan2(t.x * Math.sin(h), n * this.coslat0 * Math.cos(h) - t.y * this.sinlat0 * Math.sin(h)), this.over), t.x = i, t.y = a, t);
  } else if (Math.abs(this.coslat0) <= m) {
    if (n <= m)
      return a = this.lat0, i = this.long0, t.x = i, t.y = a, t;
    t.x *= this.con, t.y *= this.con, s = n * this.cons / (2 * this.a * this.k0), a = this.con * At(this.e, s), i = this.con * y(this.con * this.long0 + Math.atan2(t.x, -1 * t.y), this.over);
  } else
    e = 2 * Math.atan(n * this.cosX0 / (2 * this.a * this.k0 * this.ms1)), i = this.long0, n <= m ? r = this.X0 : (r = Math.asin(Math.cos(e) * this.sinX0 + t.y * Math.sin(e) * this.cosX0 / n), i = y(this.long0 + Math.atan2(t.x * Math.sin(e), n * this.cosX0 * Math.cos(e) - t.y * this.sinX0 * Math.sin(e)), this.over)), a = -1 * At(this.e, Math.tan(0.5 * (d + r)));
  return t.x = i, t.y = a, t;
}
var be = ["stere", "Stereographic_South_Pole", "Polar_Stereographic_variant_A", "Polar_Stereographic_variant_B", "Polar_Stereographic"];
const Ae = {
  init: Pe,
  forward: Ge,
  inverse: xe,
  names: be,
  ssfn_: di
};
function Ne() {
  this.k0 || (this.k0 = 1);
  var t = this.lat0;
  this.lambda0 = this.long0;
  var i = Math.sin(t), a = this.a, s = this.rf, e = 1 / s, r = 2 * e - Math.pow(e, 2), n = this.e = Math.sqrt(r);
  this.R = this.k0 * a * Math.sqrt(1 - r) / (1 - r * Math.pow(i, 2)), this.alpha = Math.sqrt(1 + r / (1 - r) * Math.pow(Math.cos(t), 4)), this.b0 = Math.asin(i / this.alpha);
  var h = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2)), o = Math.log(Math.tan(Math.PI / 4 + t / 2)), l = Math.log((1 + n * i) / (1 - n * i));
  this.K = h - this.alpha * o + this.alpha * n / 2 * l;
}
function Ie(t) {
  var i = Math.log(Math.tan(Math.PI / 4 - t.y / 2)), a = this.e / 2 * Math.log((1 + this.e * Math.sin(t.y)) / (1 - this.e * Math.sin(t.y))), s = -this.alpha * (i + a) + this.K, e = 2 * (Math.atan(Math.exp(s)) - Math.PI / 4), r = this.alpha * (t.x - this.lambda0), n = Math.atan(Math.sin(r) / (Math.sin(this.b0) * Math.tan(e) + Math.cos(this.b0) * Math.cos(r))), h = Math.asin(Math.cos(this.b0) * Math.sin(e) - Math.sin(this.b0) * Math.cos(e) * Math.cos(r));
  return t.y = this.R / 2 * Math.log((1 + Math.sin(h)) / (1 - Math.sin(h))) + this.y0, t.x = this.R * n + this.x0, t;
}
function Ce(t) {
  for (var i = t.x - this.x0, a = t.y - this.y0, s = i / this.R, e = 2 * (Math.atan(Math.exp(a / this.R)) - Math.PI / 4), r = Math.asin(Math.cos(this.b0) * Math.sin(e) + Math.sin(this.b0) * Math.cos(e) * Math.cos(s)), n = Math.atan(Math.sin(s) / (Math.cos(this.b0) * Math.cos(s) - Math.sin(this.b0) * Math.tan(e))), h = this.lambda0 + n / this.alpha, o = 0, l = r, _ = -1e3, f = 0; Math.abs(l - _) > 1e-7; ) {
    if (++f > 20)
      return;
    o = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + r / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(l)) / 2)), _ = l, l = 2 * Math.atan(Math.exp(o)) - Math.PI / 2;
  }
  return t.x = h, t.y = l, t;
}
var Re = ["somerc"];
const Te = {
  init: Ne,
  forward: Ie,
  inverse: Ce,
  names: Re
};
var rt = 1e-7;
function pe(t) {
  var i = ["Hotine_Oblique_Mercator", "Hotine_Oblique_Mercator_variant_A", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin"], a = typeof t.projName == "object" ? Object.keys(t.projName)[0] : t.projName;
  return "no_uoff" in t || "no_off" in t || i.indexOf(a) !== -1 || i.indexOf(Yi(a)) !== -1;
}
function Oe() {
  var t, i, a, s, e, r, n, h, o, l, _ = 0, f, u = 0, g = 0, M = 0, c = 0, v = 0, E = 0;
  this.k0 || (this.k0 = 1), this.no_off = pe(this), this.no_rot = "no_rot" in this;
  var S = !1;
  "alpha" in this && (S = !0);
  var w = !1;
  if ("rectified_grid_angle" in this && (w = !0), S && (E = this.alpha), w && (_ = this.rectified_grid_angle, S || (E = 0, S = !0)), S || w)
    u = this.longc;
  else if (g = this.long1, c = this.lat1, M = this.long2, v = this.lat2, Math.abs(c - v) <= rt || (t = Math.abs(c)) <= rt || Math.abs(t - d) <= rt || Math.abs(Math.abs(this.lat0) - d) <= rt || Math.abs(Math.abs(v) - d) <= rt)
    throw new Error();
  var P = 1 - this.es;
  i = Math.sqrt(P), Math.abs(this.lat0) > m ? (h = Math.sin(this.lat0), a = Math.cos(this.lat0), t = 1 - this.es * h * h, this.B = a * a, this.B = Math.sqrt(1 + this.es * this.B * this.B / P), this.A = this.B * this.k0 * i / t, s = this.B * i / (a * Math.sqrt(t)), e = s * s - 1, e <= 0 ? e = 0 : (e = Math.sqrt(e), this.lat0 < 0 && (e = -e)), this.E = e += s, this.E *= Math.pow(j(this.e, this.lat0, h), this.B)) : (this.B = 1 / i, this.A = this.k0, this.E = s = e = 1), S || w ? (S ? (f = Math.asin(Math.sin(E) / s), w || (_ = E)) : (f = _, E = Math.asin(s * Math.sin(f))), this.lam0 = u - Math.asin(0.5 * (e - 1 / e) * Math.tan(f)) / this.B) : (r = Math.pow(j(this.e, c, Math.sin(c)), this.B), n = Math.pow(j(this.e, v, Math.sin(v)), this.B), e = this.E / r, o = (n - r) / (n + r), l = this.E * this.E, l = (l - n * r) / (l + n * r), t = g - M, t < -Math.PI ? M -= xt : t > Math.PI && (M += xt), this.lam0 = y(0.5 * (g + M) - Math.atan(l * Math.tan(0.5 * this.B * (g - M)) / o) / this.B, this.over), f = Math.atan(2 * Math.sin(this.B * y(g - this.lam0, this.over)) / (e - 1 / e)), _ = E = Math.asin(s * Math.sin(f))), this.singam = Math.sin(f), this.cosgam = Math.cos(f), this.sinrot = Math.sin(_), this.cosrot = Math.cos(_), this.rB = 1 / this.B, this.ArB = this.A * this.rB, this.BrA = 1 / this.ArB, this.no_off ? this.u_0 = 0 : (this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(s * s - 1) / Math.cos(E))), this.lat0 < 0 && (this.u_0 = -this.u_0)), e = 0.5 * f, this.v_pole_n = this.ArB * Math.log(Math.tan(b - e)), this.v_pole_s = this.ArB * Math.log(Math.tan(b + e));
}
function Le(t) {
  var i = {}, a, s, e, r, n, h, o, l;
  if (t.x = t.x - this.lam0, Math.abs(Math.abs(t.y) - d) > m) {
    if (n = this.E / Math.pow(j(this.e, t.y, Math.sin(t.y)), this.B), h = 1 / n, a = 0.5 * (n - h), s = 0.5 * (n + h), r = Math.sin(this.B * t.x), e = (a * this.singam - r * this.cosgam) / s, Math.abs(Math.abs(e) - 1) < m)
      throw new Error();
    l = 0.5 * this.ArB * Math.log((1 - e) / (1 + e)), h = Math.cos(this.B * t.x), Math.abs(h) < rt ? o = this.A * t.x : o = this.ArB * Math.atan2(a * this.cosgam + r * this.singam, h);
  } else
    l = t.y > 0 ? this.v_pole_n : this.v_pole_s, o = this.ArB * t.y;
  return this.no_rot ? (i.x = o, i.y = l) : (o -= this.u_0, i.x = l * this.cosrot + o * this.sinrot, i.y = o * this.cosrot - l * this.sinrot), i.x = this.a * i.x + this.x0, i.y = this.a * i.y + this.y0, t.z !== void 0 && (i.z = t.z), t.m !== void 0 && (i.m = t.m), i;
}
function qe(t) {
  var i, a, s, e, r, n, h, o = {};
  if (t.x = (t.x - this.x0) * (1 / this.a), t.y = (t.y - this.y0) * (1 / this.a), this.no_rot ? (a = t.y, i = t.x) : (a = t.x * this.cosrot - t.y * this.sinrot, i = t.y * this.cosrot + t.x * this.sinrot + this.u_0), s = Math.exp(-this.BrA * a), e = 0.5 * (s - 1 / s), r = 0.5 * (s + 1 / s), n = Math.sin(this.BrA * i), h = (n * this.cosgam + e * this.singam) / r, Math.abs(Math.abs(h) - 1) < m)
    o.x = 0, o.y = h < 0 ? -d : d;
  else {
    if (o.y = this.E / Math.sqrt((1 + h) / (1 - h)), o.y = At(this.e, Math.pow(o.y, 1 / this.B)), o.y === 1 / 0)
      throw new Error();
    o.x = -this.rB * Math.atan2(e * this.cosgam - n * this.singam, Math.cos(this.BrA * i));
  }
  return o.x += this.lam0, t.z !== void 0 && (o.z = t.z), t.m !== void 0 && (o.m = t.m), o;
}
var Ue = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_variant_A", "Hotine_Oblique_Mercator_Variant_B", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Two_Point_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "Oblique_Mercator", "omerc"];
const De = {
  init: Oe,
  forward: Le,
  inverse: qe,
  names: Ue
};
function ke() {
  if (this.lat2 || (this.lat2 = this.lat1), this.k0 || (this.k0 = 1), this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, !(Math.abs(this.lat1 + this.lat2) < m)) {
    var t = this.b / this.a;
    this.e = Math.sqrt(1 - t * t);
    var i = Math.sin(this.lat1), a = Math.cos(this.lat1), s = H(this.e, i, a), e = j(this.e, this.lat1, i), r = Math.sin(this.lat2), n = Math.cos(this.lat2), h = H(this.e, r, n), o = j(this.e, this.lat2, r), l = j(this.e, this.lat0, Math.sin(this.lat0));
    Math.abs(this.lat1 - this.lat2) > m ? this.ns = Math.log(s / h) / Math.log(e / o) : this.ns = i, isNaN(this.ns) && (this.ns = i), this.f0 = s / (this.ns * Math.pow(e, this.ns)), this.rh = Math.abs(Math.abs(this.lat0) - d) < m ? 0 : this.a * this.f0 * Math.pow(l, this.ns), this.title || (this.title = "Lambert Conformal Conic");
  }
}
function Fe(t) {
  var i = t.x, a = t.y;
  Math.abs(2 * Math.abs(a) - Math.PI) <= m && (a = It(a) * (d - 2 * m));
  var s = Math.abs(Math.abs(a) - d), e, r;
  if (s > m)
    e = j(this.e, a, Math.sin(a)), r = this.a * this.f0 * Math.pow(e, this.ns);
  else {
    if (s = a * this.ns, s <= 0)
      return null;
    r = 0;
  }
  var n = this.ns * y(i - this.long0, this.over);
  return t.x = this.k0 * (r * Math.sin(n)) + this.x0, t.y = this.k0 * (this.rh - r * Math.cos(n)) + this.y0, t;
}
function $e(t) {
  var i, a, s, e, r, n = (t.x - this.x0) / this.k0, h = this.rh - (t.y - this.y0) / this.k0;
  this.ns > 0 ? (i = Math.sqrt(n * n + h * h), a = 1) : (i = -Math.sqrt(n * n + h * h), a = -1);
  var o = 0;
  if (i !== 0 && (o = Math.atan2(a * n, a * h)), i !== 0 || this.ns > 0) {
    if (a = 1 / this.ns, s = Math.pow(i / (this.a * this.f0), a), e = At(this.e, s), e === -9999)
      return null;
  } else
    e = -d;
  return r = y(o / this.ns + this.long0, this.over), t.x = r, t.y = e, t;
}
var ze = [
  "Lambert Tangential Conformal Conic Projection",
  "Lambert_Conformal_Conic",
  "Lambert_Conformal_Conic_1SP",
  "Lambert_Conformal_Conic_2SP",
  "lcc",
  "Lambert Conic Conformal (1SP)",
  "Lambert Conic Conformal (2SP)"
];
const Be = {
  init: ke,
  forward: Fe,
  inverse: $e,
  names: ze
};
function je() {
  this.a = 6377397155e-3, this.es = 0.006674372230614, this.e = Math.sqrt(this.es), this.lat0 || (this.lat0 = 0.863937979737193), this.long0 || (this.long0 = 0.7417649320975901 - 0.308341501185665), this.k0 || (this.k0 = 0.9999), this.s45 = 0.785398163397448, this.s90 = 2 * this.s45, this.fi0 = this.lat0, this.e2 = this.es, this.e = Math.sqrt(this.e2), this.alfa = Math.sqrt(1 + this.e2 * Math.pow(Math.cos(this.fi0), 4) / (1 - this.e2)), this.uq = 1.04216856380474, this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa), this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2), this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g, this.k1 = this.k0, this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2)), this.s0 = 1.37008346281555, this.n = Math.sin(this.s0), this.ro0 = this.k1 * this.n0 / Math.tan(this.s0), this.ad = this.s90 - this.uq;
}
function We(t) {
  var i, a, s, e, r, n, h, o = t.x, l = t.y, _ = y(o - this.long0, this.over);
  return i = Math.pow((1 + this.e * Math.sin(l)) / (1 - this.e * Math.sin(l)), this.alfa * this.e / 2), a = 2 * (Math.atan(this.k * Math.pow(Math.tan(l / 2 + this.s45), this.alfa) / i) - this.s45), s = -_ * this.alfa, e = Math.asin(Math.cos(this.ad) * Math.sin(a) + Math.sin(this.ad) * Math.cos(a) * Math.cos(s)), r = Math.asin(Math.cos(a) * Math.sin(s) / Math.cos(e)), n = this.n * r, h = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(e / 2 + this.s45), this.n), t.y = h * Math.cos(n) / 1, t.x = h * Math.sin(n) / 1, this.czech || (t.y *= -1, t.x *= -1), t;
}
function He(t) {
  var i, a, s, e, r, n, h, o, l = t.x;
  t.x = t.y, t.y = l, this.czech || (t.y *= -1, t.x *= -1), n = Math.sqrt(t.x * t.x + t.y * t.y), r = Math.atan2(t.y, t.x), e = r / Math.sin(this.s0), s = 2 * (Math.atan(Math.pow(this.ro0 / n, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45), i = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(e)), a = Math.asin(Math.cos(s) * Math.sin(e) / Math.cos(i)), t.x = this.long0 - a / this.alfa, h = i, o = 0;
  var _ = 0;
  do
    t.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(i / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(h)) / (1 - this.e * Math.sin(h)), this.e / 2)) - this.s45), Math.abs(h - t.y) < 1e-10 && (o = 1), h = t.y, _ += 1;
  while (o === 0 && _ < 15);
  return _ >= 15 ? null : t;
}
var Qe = ["Krovak", "Krovak Modified", "Krovak (North Orientated)", "Krovak Modified (North Orientated)", "krovak"];
const Ke = {
  init: je,
  forward: We,
  inverse: He,
  names: Qe
};
function q(t, i, a, s, e) {
  return t * e - i * Math.sin(2 * e) + a * Math.sin(4 * e) - s * Math.sin(6 * e);
}
function Ct(t) {
  return 1 - 0.25 * t * (1 + t / 16 * (3 + 1.25 * t));
}
function Rt(t) {
  return 0.375 * t * (1 + 0.25 * t * (1 + 0.46875 * t));
}
function Tt(t) {
  return 0.05859375 * t * t * (1 + 0.75 * t);
}
function pt(t) {
  return t * t * t * (35 / 3072);
}
function mi(t, i, a) {
  var s = i * a;
  return t / Math.sqrt(1 - s * s);
}
function Z(t) {
  return Math.abs(t) < d ? t : t - It(t) * Math.PI;
}
function jt(t, i, a, s, e) {
  var r, n;
  r = t / i;
  for (var h = 0; h < 15; h++)
    if (n = (t - (i * r - a * Math.sin(2 * r) + s * Math.sin(4 * r) - e * Math.sin(6 * r))) / (i - 2 * a * Math.cos(2 * r) + 4 * s * Math.cos(4 * r) - 6 * e * Math.cos(6 * r)), r += n, Math.abs(n) <= 1e-10)
      return r;
  return NaN;
}
function Ve() {
  this.sphere || (this.e0 = Ct(this.es), this.e1 = Rt(this.es), this.e2 = Tt(this.es), this.e3 = pt(this.es), this.ml0 = this.a * q(this.e0, this.e1, this.e2, this.e3, this.lat0));
}
function Xe(t) {
  var i, a, s = t.x, e = t.y;
  if (s = y(s - this.long0, this.over), this.sphere)
    i = this.a * Math.asin(Math.cos(e) * Math.sin(s)), a = this.a * (Math.atan2(Math.tan(e), Math.cos(s)) - this.lat0);
  else {
    var r = Math.sin(e), n = Math.cos(e), h = mi(this.a, this.e, r), o = Math.tan(e) * Math.tan(e), l = s * Math.cos(e), _ = l * l, f = this.es * n * n / (1 - this.es), u = this.a * q(this.e0, this.e1, this.e2, this.e3, e);
    i = h * l * (1 - _ * o * (1 / 6 - (8 - o + 8 * f) * _ / 120)), a = u - this.ml0 + h * r / n * _ * (0.5 + (5 - o + 6 * f) * _ / 24);
  }
  return t.x = i + this.x0, t.y = a + this.y0, t;
}
function Je(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i = t.x / this.a, a = t.y / this.a, s, e;
  if (this.sphere) {
    var r = a + this.lat0;
    s = Math.asin(Math.sin(r) * Math.cos(i)), e = Math.atan2(Math.tan(i), Math.cos(r));
  } else {
    var n = this.ml0 / this.a + a, h = jt(n, this.e0, this.e1, this.e2, this.e3);
    if (Math.abs(Math.abs(h) - d) <= m)
      return t.x = this.long0, t.y = d, a < 0 && (t.y *= -1), t;
    var o = mi(this.a, this.e, Math.sin(h)), l = o * o * o / this.a / this.a * (1 - this.es), _ = Math.pow(Math.tan(h), 2), f = i * this.a / o, u = f * f;
    s = h - o * Math.tan(h) / l * f * f * (0.5 - (1 + 3 * _) * f * f / 24), e = f * (1 - u * (_ / 3 + (1 + 3 * _) * _ * u / 15)) / Math.cos(h);
  }
  return t.x = y(e + this.long0, this.over), t.y = Z(s), t;
}
var Ze = ["Cassini", "Cassini_Soldner", "cass"];
const Ye = {
  init: Ve,
  forward: Xe,
  inverse: Je,
  names: Ze
};
function W(t, i) {
  var a;
  return t > 1e-7 ? (a = t * i, (1 - t * t) * (i / (1 - a * a) - 0.5 / t * Math.log((1 - a) / (1 + a)))) : 2 * i;
}
var tr = 0.3333333333333333, ir = 0.17222222222222222, ar = 0.10257936507936508, sr = 0.06388888888888888, er = 0.0664021164021164, rr = 0.016415012942191543;
function ca(t) {
  var i, a = [];
  return a[0] = t * tr, i = t * t, a[0] += i * ir, a[1] = i * sr, i *= t, a[0] += i * ar, a[1] += i * er, a[2] = i * rr, a;
}
function _a(t, i) {
  var a = t + t;
  return t + i[0] * Math.sin(a) + i[1] * Math.sin(a + a) + i[2] * Math.sin(a + a + a);
}
var ei = 1, ri = 2, hi = 3, Ft = 4;
function hr() {
  var t = Math.abs(this.lat0);
  if (Math.abs(t - d) < m ? this.mode = this.lat0 < 0 ? ei : ri : Math.abs(t) < m ? this.mode = hi : this.mode = Ft, this.es > 0) {
    var i;
    switch (this.qp = W(this.e, 1), this.mmf = 0.5 / (1 - this.es), this.apa = ca(this.es), this.mode) {
      case ri:
        this.dd = 1;
        break;
      case ei:
        this.dd = 1;
        break;
      case hi:
        this.rq = Math.sqrt(0.5 * this.qp), this.dd = 1 / this.rq, this.xmf = 1, this.ymf = 0.5 * this.qp;
        break;
      case Ft:
        this.rq = Math.sqrt(0.5 * this.qp), i = Math.sin(this.lat0), this.sinb1 = W(this.e, i) / this.qp, this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1), this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * i * i) * this.rq * this.cosb1), this.ymf = (this.xmf = this.rq) / this.dd, this.xmf *= this.dd;
        break;
    }
  } else
    this.mode === Ft && (this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0));
}
function nr(t) {
  var i, a, s, e, r, n, h, o, l, _, f = t.x, u = t.y;
  if (f = y(f - this.long0, this.over), this.sphere) {
    if (r = Math.sin(u), _ = Math.cos(u), s = Math.cos(f), this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (a = this.mode === this.EQUIT ? 1 + _ * s : 1 + this.sinph0 * r + this.cosph0 * _ * s, a <= m)
        return null;
      a = Math.sqrt(2 / a), i = a * _ * Math.sin(f), a *= this.mode === this.EQUIT ? r : this.cosph0 * r - this.sinph0 * _ * s;
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (s = -s), Math.abs(u + this.lat0) < m)
        return null;
      a = b - u * 0.5, a = 2 * (this.mode === this.S_POLE ? Math.cos(a) : Math.sin(a)), i = a * Math.sin(f), a *= s;
    }
  } else {
    switch (h = 0, o = 0, l = 0, s = Math.cos(f), e = Math.sin(f), r = Math.sin(u), n = W(this.e, r), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (h = n / this.qp, o = Math.sqrt(1 - h * h)), this.mode) {
      case this.OBLIQ:
        l = 1 + this.sinb1 * h + this.cosb1 * o * s;
        break;
      case this.EQUIT:
        l = 1 + o * s;
        break;
      case this.N_POLE:
        l = d + u, n = this.qp - n;
        break;
      case this.S_POLE:
        l = u - d, n = this.qp + n;
        break;
    }
    if (Math.abs(l) < m)
      return null;
    switch (this.mode) {
      case this.OBLIQ:
      case this.EQUIT:
        l = Math.sqrt(2 / l), this.mode === this.OBLIQ ? a = this.ymf * l * (this.cosb1 * h - this.sinb1 * o * s) : a = (l = Math.sqrt(2 / (1 + o * s))) * h * this.ymf, i = this.xmf * l * o * e;
        break;
      case this.N_POLE:
      case this.S_POLE:
        n >= 0 ? (i = (l = Math.sqrt(n)) * e, a = s * (this.mode === this.S_POLE ? l : -l)) : i = a = 0;
        break;
    }
  }
  return t.x = this.a * i + this.x0, t.y = this.a * a + this.y0, t;
}
function or(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i = t.x / this.a, a = t.y / this.a, s, e, r, n, h, o, l;
  if (this.sphere) {
    var _ = 0, f, u = 0;
    if (f = Math.sqrt(i * i + a * a), e = f * 0.5, e > 1)
      return null;
    switch (e = 2 * Math.asin(e), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (u = Math.sin(e), _ = Math.cos(e)), this.mode) {
      case this.EQUIT:
        e = Math.abs(f) <= m ? 0 : Math.asin(a * u / f), i *= u, a = _ * f;
        break;
      case this.OBLIQ:
        e = Math.abs(f) <= m ? this.lat0 : Math.asin(_ * this.sinph0 + a * u * this.cosph0 / f), i *= u * this.cosph0, a = (_ - Math.sin(e) * this.sinph0) * f;
        break;
      case this.N_POLE:
        a = -a, e = d - e;
        break;
      case this.S_POLE:
        e -= d;
        break;
    }
    s = a === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ) ? 0 : Math.atan2(i, a);
  } else {
    if (l = 0, this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (i /= this.dd, a *= this.dd, o = Math.sqrt(i * i + a * a), o < m)
        return t.x = this.long0, t.y = this.lat0, t;
      n = 2 * Math.asin(0.5 * o / this.rq), r = Math.cos(n), i *= n = Math.sin(n), this.mode === this.OBLIQ ? (l = r * this.sinb1 + a * n * this.cosb1 / o, h = this.qp * l, a = o * this.cosb1 * r - a * this.sinb1 * n) : (l = a * n / o, h = this.qp * l, a = o * r);
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (a = -a), h = i * i + a * a, !h)
        return t.x = this.long0, t.y = this.lat0, t;
      l = 1 - h / this.qp, this.mode === this.S_POLE && (l = -l);
    }
    s = Math.atan2(i, a), e = _a(Math.asin(l), this.apa);
  }
  return t.x = y(this.long0 + s, this.over), t.y = e, t;
}
var lr = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
const fr = {
  init: hr,
  forward: nr,
  inverse: or,
  names: lr,
  S_POLE: ei,
  N_POLE: ri,
  EQUIT: hi,
  OBLIQ: Ft
};
function J(t) {
  return Math.abs(t) > 1 && (t = t > 1 ? 1 : -1), Math.asin(t);
}
function cr() {
  Math.abs(this.lat1 + this.lat2) < m || (this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e3 = Math.sqrt(this.es), this.sin_po = Math.sin(this.lat1), this.cos_po = Math.cos(this.lat1), this.t1 = this.sin_po, this.con = this.sin_po, this.ms1 = H(this.e3, this.sin_po, this.cos_po), this.qs1 = W(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat2), this.cos_po = Math.cos(this.lat2), this.t2 = this.sin_po, this.ms2 = H(this.e3, this.sin_po, this.cos_po), this.qs2 = W(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat0), this.cos_po = Math.cos(this.lat0), this.t3 = this.sin_po, this.qs0 = W(this.e3, this.sin_po), Math.abs(this.lat1 - this.lat2) > m ? this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1) : this.ns0 = this.con, this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1, this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0);
}
function _r(t) {
  var i = t.x, a = t.y;
  this.sin_phi = Math.sin(a), this.cos_phi = Math.cos(a);
  var s = W(this.e3, this.sin_phi), e = this.a * Math.sqrt(this.c - this.ns0 * s) / this.ns0, r = this.ns0 * y(i - this.long0, this.over), n = e * Math.sin(r) + this.x0, h = this.rh - e * Math.cos(r) + this.y0;
  return t.x = n, t.y = h, t;
}
function ur(t) {
  var i, a, s, e, r, n;
  return t.x -= this.x0, t.y = this.rh - t.y + this.y0, this.ns0 >= 0 ? (i = Math.sqrt(t.x * t.x + t.y * t.y), s = 1) : (i = -Math.sqrt(t.x * t.x + t.y * t.y), s = -1), e = 0, i !== 0 && (e = Math.atan2(s * t.x, s * t.y)), s = i * this.ns0 / this.a, this.sphere ? n = Math.asin((this.c - s * s) / (2 * this.ns0)) : (a = (this.c - s * s) / this.ns0, n = this.phi1z(this.e3, a)), r = y(e / this.ns0 + this.long0, this.over), t.x = r, t.y = n, t;
}
function Mr(t, i) {
  var a, s, e, r, n, h = J(0.5 * i);
  if (t < m)
    return h;
  for (var o = t * t, l = 1; l <= 25; l++)
    if (a = Math.sin(h), s = Math.cos(h), e = t * a, r = 1 - e * e, n = 0.5 * r * r / s * (i / (1 - o) - a / r + 0.5 / t * Math.log((1 - e) / (1 + e))), h = h + n, Math.abs(n) <= 1e-7)
      return h;
  return null;
}
var gr = ["Albers_Conic_Equal_Area", "Albers_Equal_Area", "Albers", "aea"];
const vr = {
  init: cr,
  forward: _r,
  inverse: ur,
  names: gr,
  phi1z: Mr
};
function dr() {
  this.sin_p14 = Math.sin(this.lat0), this.cos_p14 = Math.cos(this.lat0), this.infinity_dist = 1e3 * this.a, this.rc = 1;
}
function mr(t) {
  var i, a, s, e, r, n, h, o, l = t.x, _ = t.y;
  return s = y(l - this.long0, this.over), i = Math.sin(_), a = Math.cos(_), e = Math.cos(s), n = this.sin_p14 * i + this.cos_p14 * a * e, r = 1, n > 0 || Math.abs(n) <= m ? (h = this.x0 + this.a * r * a * Math.sin(s) / n, o = this.y0 + this.a * r * (this.cos_p14 * i - this.sin_p14 * a * e) / n) : (h = this.x0 + this.infinity_dist * a * Math.sin(s), o = this.y0 + this.infinity_dist * (this.cos_p14 * i - this.sin_p14 * a * e)), t.x = h, t.y = o, t;
}
function yr(t) {
  var i, a, s, e, r, n;
  return t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, t.x /= this.k0, t.y /= this.k0, (i = Math.sqrt(t.x * t.x + t.y * t.y)) ? (e = Math.atan2(i, this.rc), a = Math.sin(e), s = Math.cos(e), n = J(s * this.sin_p14 + t.y * a * this.cos_p14 / i), r = Math.atan2(t.x * a, i * this.cos_p14 * s - t.y * this.sin_p14 * a), r = y(this.long0 + r, this.over)) : (n = this.phic0, r = 0), t.x = r, t.y = n, t;
}
var Er = ["gnom"];
const Sr = {
  init: dr,
  forward: mr,
  inverse: yr,
  names: Er
};
function wr(t, i) {
  var a = 1 - (1 - t * t) / (2 * t) * Math.log((1 - t) / (1 + t));
  if (Math.abs(Math.abs(i) - a) < 1e-6)
    return i < 0 ? -1 * d : d;
  for (var s = Math.asin(0.5 * i), e, r, n, h, o = 0; o < 30; o++)
    if (r = Math.sin(s), n = Math.cos(s), h = t * r, e = Math.pow(1 - h * h, 2) / (2 * n) * (i / (1 - t * t) - r / (1 - h * h) + 0.5 / t * Math.log((1 - h) / (1 + h))), s += e, Math.abs(e) <= 1e-10)
      return s;
  return NaN;
}
function Pr() {
  this.sphere || (this.k0 = H(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)));
}
function Gr(t) {
  var i = t.x, a = t.y, s, e, r = y(i - this.long0, this.over);
  if (this.sphere)
    s = this.x0 + this.a * r * Math.cos(this.lat_ts), e = this.y0 + this.a * Math.sin(a) / Math.cos(this.lat_ts);
  else {
    var n = W(this.e, Math.sin(a));
    s = this.x0 + this.a * this.k0 * r, e = this.y0 + this.a * n * 0.5 / this.k0;
  }
  return t.x = s, t.y = e, t;
}
function xr(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i, a;
  return this.sphere ? (i = y(this.long0 + t.x / this.a / Math.cos(this.lat_ts), this.over), a = Math.asin(t.y / this.a * Math.cos(this.lat_ts))) : (a = wr(this.e, 2 * t.y * this.k0 / this.a), i = y(this.long0 + t.x / (this.a * this.k0), this.over)), t.x = i, t.y = a, t;
}
var br = ["cea"];
const Ar = {
  init: Pr,
  forward: Gr,
  inverse: xr,
  names: br
};
function Nr() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Equidistant Cylindrical (Plate Carre)", this.rc = Math.cos(this.lat_ts);
}
function Ir(t) {
  var i = t.x, a = t.y, s = y(i - this.long0, this.over), e = Z(a - this.lat0);
  return t.x = this.x0 + this.a * s * this.rc, t.y = this.y0 + this.a * e, t;
}
function Cr(t) {
  var i = t.x, a = t.y;
  return t.x = y(this.long0 + (i - this.x0) / (this.a * this.rc), this.over), t.y = Z(this.lat0 + (a - this.y0) / this.a), t;
}
var Rr = ["Equirectangular", "Equidistant_Cylindrical", "Equidistant_Cylindrical_Spherical", "eqc"];
const Tr = {
  init: Nr,
  forward: Ir,
  inverse: Cr,
  names: Rr
};
var ki = 20;
function pr() {
  this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Ct(this.es), this.e1 = Rt(this.es), this.e2 = Tt(this.es), this.e3 = pt(this.es), this.ml0 = this.a * q(this.e0, this.e1, this.e2, this.e3, this.lat0);
}
function Or(t) {
  var i = t.x, a = t.y, s, e, r, n = y(i - this.long0, this.over);
  if (r = n * Math.sin(a), this.sphere)
    Math.abs(a) <= m ? (s = this.a * n, e = -1 * this.a * this.lat0) : (s = this.a * Math.sin(r) / Math.tan(a), e = this.a * (Z(a - this.lat0) + (1 - Math.cos(r)) / Math.tan(a)));
  else if (Math.abs(a) <= m)
    s = this.a * n, e = -1 * this.ml0;
  else {
    var h = mi(this.a, this.e, Math.sin(a)) / Math.tan(a);
    s = h * Math.sin(r), e = this.a * q(this.e0, this.e1, this.e2, this.e3, a) - this.ml0 + h * (1 - Math.cos(r));
  }
  return t.x = s + this.x0, t.y = e + this.y0, t;
}
function Lr(t) {
  var i, a, s, e, r, n, h, o, l;
  if (s = t.x - this.x0, e = t.y - this.y0, this.sphere)
    if (Math.abs(e + this.a * this.lat0) <= m)
      i = y(s / this.a + this.long0, this.over), a = 0;
    else {
      n = this.lat0 + e / this.a, h = s * s / this.a / this.a + n * n, o = n;
      var _;
      for (r = ki; r; --r)
        if (_ = Math.tan(o), l = -1 * (n * (o * _ + 1) - o - 0.5 * (o * o + h) * _) / ((o - n) / _ - 1), o += l, Math.abs(l) <= m) {
          a = o;
          break;
        }
      i = y(this.long0 + Math.asin(s * Math.tan(o) / this.a) / Math.sin(a), this.over);
    }
  else if (Math.abs(e + this.ml0) <= m)
    a = 0, i = y(this.long0 + s / this.a, this.over);
  else {
    n = (this.ml0 + e) / this.a, h = s * s / this.a / this.a + n * n, o = n;
    var f, u, g, M, c;
    for (r = ki; r; --r)
      if (c = this.e * Math.sin(o), f = Math.sqrt(1 - c * c) * Math.tan(o), u = this.a * q(this.e0, this.e1, this.e2, this.e3, o), g = this.e0 - 2 * this.e1 * Math.cos(2 * o) + 4 * this.e2 * Math.cos(4 * o) - 6 * this.e3 * Math.cos(6 * o), M = u / this.a, l = (n * (f * M + 1) - M - 0.5 * f * (M * M + h)) / (this.es * Math.sin(2 * o) * (M * M + h - 2 * n * M) / (4 * f) + (n - M) * (f * g - 2 / Math.sin(2 * o)) - g), o -= l, Math.abs(l) <= m) {
        a = o;
        break;
      }
    f = Math.sqrt(1 - this.es * Math.pow(Math.sin(a), 2)) * Math.tan(a), i = y(this.long0 + Math.asin(s * f / this.a) / Math.sin(a), this.over);
  }
  return t.x = i, t.y = a, t;
}
var qr = ["Polyconic", "American_Polyconic", "poly"];
const Ur = {
  init: pr,
  forward: Or,
  inverse: Lr,
  names: qr
};
var Dr = 1;
function kr() {
  this.A = [], this.A[1] = 0.6399175073, this.A[2] = -0.1358797613, this.A[3] = 0.063294409, this.A[4] = -0.02526853, this.A[5] = 0.0117879, this.A[6] = -55161e-7, this.A[7] = 26906e-7, this.A[8] = -1333e-6, this.A[9] = 67e-5, this.A[10] = -34e-5, this.B_re = [], this.B_im = [], this.B_re[1] = 0.7557853228, this.B_im[1] = 0, this.B_re[2] = 0.249204646, this.B_im[2] = 3371507e-9, this.B_re[3] = -1541739e-9, this.B_im[3] = 0.04105856, this.B_re[4] = -0.10162907, this.B_im[4] = 0.01727609, this.B_re[5] = -0.26623489, this.B_im[5] = -0.36249218, this.B_re[6] = -0.6870983, this.B_im[6] = -1.1651967, this.C_re = [], this.C_im = [], this.C_re[1] = 1.3231270439, this.C_im[1] = 0, this.C_re[2] = -0.577245789, this.C_im[2] = -7809598e-9, this.C_re[3] = 0.508307513, this.C_im[3] = -0.112208952, this.C_re[4] = -0.15094762, this.C_im[4] = 0.18200602, this.C_re[5] = 1.01418179, this.C_im[5] = 1.64497696, this.C_re[6] = 1.9660549, this.C_im[6] = 2.5127645, this.D = [], this.D[1] = 1.5627014243, this.D[2] = 0.5185406398, this.D[3] = -0.03333098, this.D[4] = -0.1052906, this.D[5] = -0.0368594, this.D[6] = 7317e-6, this.D[7] = 0.0122, this.D[8] = 394e-5, this.D[9] = -13e-4;
}
function Fr(t) {
  var i, a = t.x, s = t.y, e = s - this.lat0, r = a - this.long0, n = e / yt * 1e-5, h = r, o = 1, l = 0;
  for (i = 1; i <= 10; i++)
    o = o * n, l = l + this.A[i] * o;
  var _ = l, f = h, u = 1, g = 0, M, c, v = 0, E = 0;
  for (i = 1; i <= 6; i++)
    M = u * _ - g * f, c = g * _ + u * f, u = M, g = c, v = v + this.B_re[i] * u - this.B_im[i] * g, E = E + this.B_im[i] * u + this.B_re[i] * g;
  return t.x = E * this.a + this.x0, t.y = v * this.a + this.y0, t;
}
function $r(t) {
  var i, a = t.x, s = t.y, e = a - this.x0, r = s - this.y0, n = r / this.a, h = e / this.a, o = 1, l = 0, _, f, u = 0, g = 0;
  for (i = 1; i <= 6; i++)
    _ = o * n - l * h, f = l * n + o * h, o = _, l = f, u = u + this.C_re[i] * o - this.C_im[i] * l, g = g + this.C_im[i] * o + this.C_re[i] * l;
  for (var M = 0; M < this.iterations; M++) {
    var c = u, v = g, E, S, w = n, P = h;
    for (i = 2; i <= 6; i++)
      E = c * u - v * g, S = v * u + c * g, c = E, v = S, w = w + (i - 1) * (this.B_re[i] * c - this.B_im[i] * v), P = P + (i - 1) * (this.B_im[i] * c + this.B_re[i] * v);
    c = 1, v = 0;
    var G = this.B_re[1], x = this.B_im[1];
    for (i = 2; i <= 6; i++)
      E = c * u - v * g, S = v * u + c * g, c = E, v = S, G = G + i * (this.B_re[i] * c - this.B_im[i] * v), x = x + i * (this.B_im[i] * c + this.B_re[i] * v);
    var N = G * G + x * x;
    u = (w * G + P * x) / N, g = (P * G - w * x) / N;
  }
  var O = u, T = g, K = 1, $ = 0;
  for (i = 1; i <= 9; i++)
    K = K * O, $ = $ + this.D[i] * K;
  var st = this.lat0 + $ * yt * 1e5, et = this.long0 + T;
  return t.x = et, t.y = st, t;
}
var zr = ["New_Zealand_Map_Grid", "nzmg"];
const Br = {
  init: kr,
  forward: Fr,
  inverse: $r,
  names: zr,
  iterations: Dr
};
function jr() {
}
function Wr(t) {
  var i = t.x, a = t.y, s = y(i - this.long0, this.over), e = this.x0 + this.a * s, r = this.y0 + this.a * Math.log(Math.tan(Math.PI / 4 + a / 2.5)) * 1.25;
  return t.x = e, t.y = r, t;
}
function Hr(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i = y(this.long0 + t.x / this.a, this.over), a = 2.5 * (Math.atan(Math.exp(0.8 * t.y / this.a)) - Math.PI / 4);
  return t.x = i, t.y = a, t;
}
var Qr = ["Miller_Cylindrical", "mill"];
const Kr = {
  init: jr,
  forward: Wr,
  inverse: Hr,
  names: Qr
};
var Vr = 20;
function Xr() {
  this.long0 = this.long0 || 0, this.sphere ? (this.n = 1, this.m = 0, this.es = 0, this.C_y = Math.sqrt((this.m + 1) / this.n), this.C_x = this.C_y / (this.m + 1)) : this.en = _i(this.es);
}
function ua(t) {
  var i, a, s = t.x, e = t.y;
  if (s = y(s - this.long0, this.over), this.sphere) {
    if (!this.m)
      e = this.n !== 1 ? Math.asin(this.n * Math.sin(e)) : e;
    else
      for (var r = this.n * Math.sin(e), n = Vr; n; --n) {
        var h = (this.m * e + Math.sin(e) - r) / (this.m + Math.cos(e));
        if (e -= h, Math.abs(h) < m)
          break;
      }
    i = this.a * this.C_x * s * (this.m + Math.cos(e)), a = this.a * this.C_y * e;
  } else {
    var o = Math.sin(e), l = Math.cos(e);
    a = this.a * Mt(e, o, l, this.en), i = this.a * s * l / Math.sqrt(1 - this.es * o * o);
  }
  return t.x = i, t.y = a, t;
}
function Ma(t) {
  var i, a, s, e;
  return t.x -= this.x0, s = t.x / this.a, t.y -= this.y0, i = t.y / this.a, this.sphere ? (i /= this.C_y, s = s / (this.C_x * (this.m + Math.cos(i))), this.m ? i = J((this.m * i + Math.sin(i)) / this.n) : this.n !== 1 && (i = J(Math.sin(i) / this.n)), s = y(s + this.long0, this.over), i = Z(i)) : (i = ui(t.y / this.a, this.es, this.en), e = Math.abs(i), e < d ? (e = Math.sin(i), a = this.long0 + t.x * Math.sqrt(1 - this.es * e * e) / (this.a * Math.cos(i)), s = y(a, this.over)) : e - m < d && (s = this.long0)), t.x = s, t.y = i, t;
}
var Jr = ["Sinusoidal", "sinu"];
const Zr = {
  init: Xr,
  forward: ua,
  inverse: Ma,
  names: Jr
};
function Yr() {
  this.sphere = !0, this.b = this.a, this.m = 1, this.n = 2.5707963267948966, this.es = 0, this.C_y = Math.sqrt((this.m + 1) / this.n), this.C_x = this.C_y / (this.m + 1);
}
var th = ua, ih = Ma, ah = ["Eckert_VI", "eck6"];
const sh = {
  init: Yr,
  forward: th,
  inverse: ih,
  names: ah
};
function eh() {
  this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0;
}
function rh(t) {
  for (var i = t.x, a = t.y, s = y(i - this.long0, this.over), e = a, r = Math.PI * Math.sin(a); ; ) {
    var n = -(e + Math.sin(e) - r) / (1 + Math.cos(e));
    if (e += n, Math.abs(n) < m)
      break;
  }
  e /= 2, Math.PI / 2 - Math.abs(a) < m && (s = 0);
  var h = 0.900316316158 * this.a * s * Math.cos(e) + this.x0, o = 1.4142135623731 * this.a * Math.sin(e) + this.y0;
  return t.x = h, t.y = o, t;
}
function hh(t) {
  var i, a;
  t.x -= this.x0, t.y -= this.y0, a = t.y / (1.4142135623731 * this.a), Math.abs(a) > 0.999999999999 && (a = 0.999999999999), i = Math.asin(a);
  var s = y(this.long0 + t.x / (0.900316316158 * this.a * Math.cos(i)), this.over);
  s < -Math.PI && (s = -Math.PI), s > Math.PI && (s = Math.PI), a = (2 * i + Math.sin(2 * i)) / Math.PI, Math.abs(a) > 1 && (a = 1);
  var e = Math.asin(a);
  return t.x = s, t.y = e, t;
}
var nh = ["Mollweide", "moll"];
const oh = {
  init: eh,
  forward: rh,
  inverse: hh,
  names: nh
};
function lh() {
  Math.abs(this.lat1 + this.lat2) < m || (this.lat2 = this.lat2 || this.lat1, this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Ct(this.es), this.e1 = Rt(this.es), this.e2 = Tt(this.es), this.e3 = pt(this.es), this.sin_phi = Math.sin(this.lat1), this.cos_phi = Math.cos(this.lat1), this.ms1 = H(this.e, this.sin_phi, this.cos_phi), this.ml1 = q(this.e0, this.e1, this.e2, this.e3, this.lat1), Math.abs(this.lat1 - this.lat2) < m ? this.ns = this.sin_phi : (this.sin_phi = Math.sin(this.lat2), this.cos_phi = Math.cos(this.lat2), this.ms2 = H(this.e, this.sin_phi, this.cos_phi), this.ml2 = q(this.e0, this.e1, this.e2, this.e3, this.lat2), this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1)), this.g = this.ml1 + this.ms1 / this.ns, this.ml0 = q(this.e0, this.e1, this.e2, this.e3, this.lat0), this.rh = this.a * (this.g - this.ml0));
}
function fh(t) {
  var i = t.x, a = t.y, s;
  if (this.sphere)
    s = this.a * (this.g - a);
  else {
    var e = q(this.e0, this.e1, this.e2, this.e3, a);
    s = this.a * (this.g - e);
  }
  var r = this.ns * y(i - this.long0, this.over), n = this.x0 + s * Math.sin(r), h = this.y0 + this.rh - s * Math.cos(r);
  return t.x = n, t.y = h, t;
}
function ch(t) {
  t.x -= this.x0, t.y = this.rh - t.y + this.y0;
  var i, a, s, e;
  this.ns >= 0 ? (a = Math.sqrt(t.x * t.x + t.y * t.y), i = 1) : (a = -Math.sqrt(t.x * t.x + t.y * t.y), i = -1);
  var r = 0;
  if (a !== 0 && (r = Math.atan2(i * t.x, i * t.y)), this.sphere)
    return e = y(this.long0 + r / this.ns, this.over), s = Z(this.g - a / this.a), t.x = e, t.y = s, t;
  var n = this.g - a / this.a;
  return s = jt(n, this.e0, this.e1, this.e2, this.e3), e = y(this.long0 + r / this.ns, this.over), t.x = e, t.y = s, t;
}
var _h = ["Equidistant_Conic", "eqdc"];
const uh = {
  init: lh,
  forward: fh,
  inverse: ch,
  names: _h
};
function Mh() {
  this.R = this.a;
}
function gh(t) {
  var i = t.x, a = t.y, s = y(i - this.long0, this.over), e, r;
  if (Math.abs(a) <= m)
    return e = this.x0 + this.R * s, r = this.y0, t.x = e, t.y = r, t;
  var n = J(2 * Math.abs(a / Math.PI));
  if (Math.abs(s) <= m || Math.abs(Math.abs(a) - d) <= m)
    return e = this.x0, a >= 0 ? r = this.y0 + Math.PI * this.R * Math.tan(0.5 * n) : r = this.y0 + Math.PI * this.R * -Math.tan(0.5 * n), t.x = e, t.y = r, t;
  var h = 0.5 * Math.abs(Math.PI / s - s / Math.PI), o = h * h, l = Math.sin(n), _ = Math.cos(n), f = _ / (l + _ - 1), u = f * f, g = f * (2 / l - 1), M = g * g, c = Math.PI * this.R * (h * (f - M) + Math.sqrt(o * (f - M) * (f - M) - (M + o) * (u - M))) / (M + o);
  s < 0 && (c = -c), e = this.x0 + c;
  var v = o + f;
  return c = Math.PI * this.R * (g * v - h * Math.sqrt((M + o) * (o + 1) - v * v)) / (M + o), a >= 0 ? r = this.y0 + c : r = this.y0 - c, t.x = e, t.y = r, t;
}
function vh(t) {
  var i, a, s, e, r, n, h, o, l, _, f, u, g;
  return t.x -= this.x0, t.y -= this.y0, f = Math.PI * this.R, s = t.x / f, e = t.y / f, r = s * s + e * e, n = -Math.abs(e) * (1 + r), h = n - 2 * e * e + s * s, o = -2 * n + 1 + 2 * e * e + r * r, g = e * e / o + (2 * h * h * h / o / o / o - 9 * n * h / o / o) / 27, l = (n - h * h / 3 / o) / o, _ = 2 * Math.sqrt(-l / 3), f = 3 * g / l / _, Math.abs(f) > 1 && (f >= 0 ? f = 1 : f = -1), u = Math.acos(f) / 3, t.y >= 0 ? a = (-_ * Math.cos(u + Math.PI / 3) - h / 3 / o) * Math.PI : a = -(-_ * Math.cos(u + Math.PI / 3) - h / 3 / o) * Math.PI, Math.abs(s) < m ? i = this.long0 : i = y(this.long0 + Math.PI * (r - 1 + Math.sqrt(1 + 2 * (s * s - e * e) + r * r)) / 2 / s, this.over), t.x = i, t.y = a, t;
}
var dh = ["Van_der_Grinten_I", "VanDerGrinten", "Van_der_Grinten", "vandg"];
const mh = {
  init: Mh,
  forward: gh,
  inverse: vh,
  names: dh
};
function yh(t, i, a, s, e, r) {
  const n = s - i, h = Math.atan((1 - r) * Math.tan(t)), o = Math.atan((1 - r) * Math.tan(a)), l = Math.sin(h), _ = Math.cos(h), f = Math.sin(o), u = Math.cos(o);
  let g = n, M, c = 100, v, E, S, w, P, G, x, N, O, T, K, $, st, et;
  do {
    if (v = Math.sin(g), E = Math.cos(g), S = Math.sqrt(
      u * v * (u * v) + (_ * f - l * u * E) * (_ * f - l * u * E)
    ), S === 0)
      return { azi1: 0, s12: 0 };
    w = l * f + _ * u * E, P = Math.atan2(S, w), G = _ * u * v / S, x = 1 - G * G, N = x !== 0 ? w - 2 * l * f / x : 0, O = r / 16 * x * (4 + r * (4 - 3 * x)), M = g, g = n + (1 - O) * r * G * (P + O * S * (N + O * w * (-1 + 2 * N * N)));
  } while (Math.abs(g - M) > 1e-12 && --c > 0);
  return c === 0 ? { azi1: NaN, s12: NaN } : (T = x * (e * e - e * (1 - r) * (e * (1 - r))) / (e * (1 - r) * (e * (1 - r))), K = 1 + T / 16384 * (4096 + T * (-768 + T * (320 - 175 * T))), $ = T / 1024 * (256 + T * (-128 + T * (74 - 47 * T))), st = $ * S * (N + $ / 4 * (w * (-1 + 2 * N * N) - $ / 6 * N * (-3 + 4 * S * S) * (-3 + 4 * N * N))), et = e * (1 - r) * K * (P - st), { azi1: Math.atan2(u * v, _ * f - l * u * E), s12: et });
}
function Eh(t, i, a, s, e, r) {
  const n = Math.atan((1 - r) * Math.tan(t)), h = Math.sin(n), o = Math.cos(n), l = Math.sin(a), _ = Math.cos(a), f = Math.atan2(h, o * _), u = o * l, g = 1 - u * u, M = g * (e * e - e * (1 - r) * (e * (1 - r))) / (e * (1 - r) * (e * (1 - r))), c = 1 + M / 16384 * (4096 + M * (-768 + M * (320 - 175 * M))), v = M / 1024 * (256 + M * (-128 + M * (74 - 47 * M)));
  let E = s / (e * (1 - r) * c), S, w = 100, P, G, x, N;
  do
    P = Math.cos(2 * f + E), G = Math.sin(E), x = Math.cos(E), N = v * G * (P + v / 4 * (x * (-1 + 2 * P * P) - v / 6 * P * (-3 + 4 * G * G) * (-3 + 4 * P * P))), S = E, E = s / (e * (1 - r) * c) + N;
  while (Math.abs(E - S) > 1e-12 && --w > 0);
  if (w === 0)
    return { lat2: NaN, lon2: NaN };
  const O = h * G - o * x * _, T = Math.atan2(
    h * x + o * G * _,
    (1 - r) * Math.sqrt(u * u + O * O)
  ), K = Math.atan2(
    G * l,
    o * x - h * G * _
  ), $ = r / 16 * g * (4 + r * (4 - 3 * g)), st = K - (1 - $) * r * u * (E + $ * G * (P + $ * x * (-1 + 2 * P * P))), et = i + st;
  return { lat2: T, lon2: et };
}
function Sh() {
  this.sin_p12 = Math.sin(this.lat0), this.cos_p12 = Math.cos(this.lat0), this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.f = this.es / (1 + Math.sqrt(1 - this.es));
}
function wh(t) {
  var i = t.x, a = t.y, s = Math.sin(t.y), e = Math.cos(t.y), r = y(i - this.long0, this.over), n, h, o, l, _, f, u, g, M, c, v;
  return this.sphere ? Math.abs(this.sin_p12 - 1) <= m ? (t.x = this.x0 + this.a * (d - a) * Math.sin(r), t.y = this.y0 - this.a * (d - a) * Math.cos(r), t) : Math.abs(this.sin_p12 + 1) <= m ? (t.x = this.x0 + this.a * (d + a) * Math.sin(r), t.y = this.y0 + this.a * (d + a) * Math.cos(r), t) : (M = this.sin_p12 * s + this.cos_p12 * e * Math.cos(r), u = Math.acos(M), g = u ? u / Math.sin(u) : 1, t.x = this.x0 + this.a * g * e * Math.sin(r), t.y = this.y0 + this.a * g * (this.cos_p12 * s - this.sin_p12 * e * Math.cos(r)), t) : (n = Ct(this.es), h = Rt(this.es), o = Tt(this.es), l = pt(this.es), Math.abs(this.sin_p12 - 1) <= m ? (_ = this.a * q(n, h, o, l, d), f = this.a * q(n, h, o, l, a), t.x = this.x0 + (_ - f) * Math.sin(r), t.y = this.y0 - (_ - f) * Math.cos(r), t) : Math.abs(this.sin_p12 + 1) <= m ? (_ = this.a * q(n, h, o, l, d), f = this.a * q(n, h, o, l, a), t.x = this.x0 + (_ + f) * Math.sin(r), t.y = this.y0 + (_ + f) * Math.cos(r), t) : Math.abs(i) < m && Math.abs(a - this.lat0) < m ? (t.x = this.x0, t.y = this.y0, t) : (c = yh(this.lat0, this.long0, a, i, this.a, this.f), v = c.azi1, t.x = this.x0 + c.s12 * Math.sin(v), t.y = this.y0 + c.s12 * Math.cos(v), t));
}
function Ph(t) {
  t.x -= this.x0, t.y -= this.y0;
  var i, a, s, e, r, n, h, o, l, _, f, u, g, M, c, v;
  return this.sphere ? (i = Math.sqrt(t.x * t.x + t.y * t.y), i > 2 * d * this.a ? void 0 : (a = i / this.a, s = Math.sin(a), e = Math.cos(a), r = this.long0, Math.abs(i) <= m ? n = this.lat0 : (n = J(e * this.sin_p12 + t.y * s * this.cos_p12 / i), h = Math.abs(this.lat0) - d, Math.abs(h) <= m ? this.lat0 >= 0 ? r = y(this.long0 + Math.atan2(t.x, -t.y), this.over) : r = y(this.long0 - Math.atan2(-t.x, t.y), this.over) : r = y(this.long0 + Math.atan2(t.x * s, i * this.cos_p12 * e - t.y * this.sin_p12 * s), this.over)), t.x = r, t.y = n, t)) : (o = Ct(this.es), l = Rt(this.es), _ = Tt(this.es), f = pt(this.es), Math.abs(this.sin_p12 - 1) <= m ? (u = this.a * q(o, l, _, f, d), i = Math.sqrt(t.x * t.x + t.y * t.y), g = u - i, n = jt(g / this.a, o, l, _, f), r = y(this.long0 + Math.atan2(t.x, -1 * t.y), this.over), t.x = r, t.y = n, t) : Math.abs(this.sin_p12 + 1) <= m ? (u = this.a * q(o, l, _, f, d), i = Math.sqrt(t.x * t.x + t.y * t.y), g = i - u, n = jt(g / this.a, o, l, _, f), r = y(this.long0 + Math.atan2(t.x, t.y), this.over), t.x = r, t.y = n, t) : (M = Math.atan2(t.x, t.y), c = Math.sqrt(t.x * t.x + t.y * t.y), v = Eh(this.lat0, this.long0, M, c, this.a, this.f), t.x = v.lon2, t.y = v.lat2, t));
}
var Gh = ["Azimuthal_Equidistant", "aeqd"];
const xh = {
  init: Sh,
  forward: wh,
  inverse: Ph,
  names: Gh
};
function bh() {
  this.sin_p14 = Math.sin(this.lat0 || 0), this.cos_p14 = Math.cos(this.lat0 || 0);
}
function Ah(t) {
  var i, a, s, e, r, n, h, o, l = t.x, _ = t.y;
  return s = y(l - (this.long0 || 0), this.over), i = Math.sin(_), a = Math.cos(_), e = Math.cos(s), n = this.sin_p14 * i + this.cos_p14 * a * e, r = 1, (n > 0 || Math.abs(n) <= m) && (h = (this.x0 || 0) + this.a * r * a * Math.sin(s), o = (this.y0 || 0) + this.a * r * (this.cos_p14 * i - this.sin_p14 * a * e)), t.x = h, t.y = o, t;
}
function Nh(t) {
  var i, a, s, e, r, n, h, o, l;
  return t.x -= this.x0 || 0, t.y -= this.y0 || 0, i = Math.sqrt(t.x * t.x + t.y * t.y), a = J(i / this.a), s = Math.sin(a), e = Math.cos(a), o = this.long0 || 0, l = this.lat0 || 0, n = o, Math.abs(i) <= m ? (h = l, t.x = n, t.y = h, t) : (h = J(e * this.sin_p14 + t.y * s * this.cos_p14 / i), r = Math.abs(l) - d, Math.abs(r) <= m ? (l >= 0 ? n = y(o + Math.atan2(t.x, -t.y), this.over) : n = y(o - Math.atan2(-t.x, t.y), this.over), t.x = n, t.y = h, t) : (n = y(o + Math.atan2(t.x * s, i * this.cos_p14 * e - t.y * this.sin_p14 * s), this.over), t.x = n, t.y = h, t));
}
var Ih = ["ortho"];
const Ch = {
  init: bh,
  forward: Ah,
  inverse: Nh,
  names: Ih
};
var C = {
  FRONT: 1,
  RIGHT: 2,
  BACK: 3,
  LEFT: 4,
  TOP: 5,
  BOTTOM: 6
}, A = {
  AREA_0: 1,
  AREA_1: 2,
  AREA_2: 3,
  AREA_3: 4
};
function Rh() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Quadrilateralized Spherical Cube", this.lat0 >= d - b / 2 ? this.face = C.TOP : this.lat0 <= -(d - b / 2) ? this.face = C.BOTTOM : Math.abs(this.long0) <= b ? this.face = C.FRONT : Math.abs(this.long0) <= d + b ? this.face = this.long0 > 0 ? C.RIGHT : C.LEFT : this.face = C.BACK, this.es !== 0 && (this.one_minus_f = 1 - (this.a - this.b) / this.a, this.one_minus_f_squared = this.one_minus_f * this.one_minus_f);
}
function Th(t) {
  var i = { x: 0, y: 0 }, a, s, e, r, n, h, o = { value: 0 };
  if (t.x -= this.long0, this.es !== 0 ? a = Math.atan(this.one_minus_f_squared * Math.tan(t.y)) : a = t.y, s = t.x, this.face === C.TOP)
    r = d - a, s >= b && s <= d + b ? (o.value = A.AREA_0, e = s - d) : s > d + b || s <= -(d + b) ? (o.value = A.AREA_1, e = s > 0 ? s - R : s + R) : s > -(d + b) && s <= -b ? (o.value = A.AREA_2, e = s + d) : (o.value = A.AREA_3, e = s);
  else if (this.face === C.BOTTOM)
    r = d + a, s >= b && s <= d + b ? (o.value = A.AREA_0, e = -s + d) : s < b && s >= -b ? (o.value = A.AREA_1, e = -s) : s < -b && s >= -(d + b) ? (o.value = A.AREA_2, e = -s - d) : (o.value = A.AREA_3, e = s > 0 ? -s + R : -s - R);
  else {
    var l, _, f, u, g, M, c;
    this.face === C.RIGHT ? s = _t(s, +d) : this.face === C.BACK ? s = _t(s, +R) : this.face === C.LEFT && (s = _t(s, -d)), u = Math.sin(a), g = Math.cos(a), M = Math.sin(s), c = Math.cos(s), l = g * c, _ = g * M, f = u, this.face === C.FRONT ? (r = Math.acos(l), e = qt(r, f, _, o)) : this.face === C.RIGHT ? (r = Math.acos(_), e = qt(r, f, -l, o)) : this.face === C.BACK ? (r = Math.acos(-l), e = qt(r, f, -_, o)) : this.face === C.LEFT ? (r = Math.acos(-_), e = qt(r, f, l, o)) : (r = e = 0, o.value = A.AREA_0);
  }
  return h = Math.atan(12 / R * (e + Math.acos(Math.sin(e) * Math.cos(b)) - d)), n = Math.sqrt((1 - Math.cos(r)) / (Math.cos(h) * Math.cos(h)) / (1 - Math.cos(Math.atan(1 / Math.cos(e))))), o.value === A.AREA_1 ? h += d : o.value === A.AREA_2 ? h += R : o.value === A.AREA_3 && (h += 1.5 * R), i.x = n * Math.cos(h), i.y = n * Math.sin(h), i.x = i.x * this.a + this.x0, i.y = i.y * this.a + this.y0, t.x = i.x, t.y = i.y, t;
}
function ph(t) {
  var i = { lam: 0, phi: 0 }, a, s, e, r, n, h, o, l, _, f = { value: 0 };
  if (t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, s = Math.atan(Math.sqrt(t.x * t.x + t.y * t.y)), a = Math.atan2(t.y, t.x), t.x >= 0 && t.x >= Math.abs(t.y) ? f.value = A.AREA_0 : t.y >= 0 && t.y >= Math.abs(t.x) ? (f.value = A.AREA_1, a -= d) : t.x < 0 && -t.x >= Math.abs(t.y) ? (f.value = A.AREA_2, a = a < 0 ? a + R : a - R) : (f.value = A.AREA_3, a += d), _ = R / 12 * Math.tan(a), n = Math.sin(_) / (Math.cos(_) - 1 / Math.sqrt(2)), h = Math.atan(n), e = Math.cos(a), r = Math.tan(s), o = 1 - e * e * r * r * (1 - Math.cos(Math.atan(1 / Math.cos(h)))), o < -1 ? o = -1 : o > 1 && (o = 1), this.face === C.TOP)
    l = Math.acos(o), i.phi = d - l, f.value === A.AREA_0 ? i.lam = h + d : f.value === A.AREA_1 ? i.lam = h < 0 ? h + R : h - R : f.value === A.AREA_2 ? i.lam = h - d : i.lam = h;
  else if (this.face === C.BOTTOM)
    l = Math.acos(o), i.phi = l - d, f.value === A.AREA_0 ? i.lam = -h + d : f.value === A.AREA_1 ? i.lam = -h : f.value === A.AREA_2 ? i.lam = -h - d : i.lam = h < 0 ? -h - R : -h + R;
  else {
    var u, g, M;
    u = o, _ = u * u, _ >= 1 ? M = 0 : M = Math.sqrt(1 - _) * Math.sin(h), _ += M * M, _ >= 1 ? g = 0 : g = Math.sqrt(1 - _), f.value === A.AREA_1 ? (_ = g, g = -M, M = _) : f.value === A.AREA_2 ? (g = -g, M = -M) : f.value === A.AREA_3 && (_ = g, g = M, M = -_), this.face === C.RIGHT ? (_ = u, u = -g, g = _) : this.face === C.BACK ? (u = -u, g = -g) : this.face === C.LEFT && (_ = u, u = g, g = -_), i.phi = Math.acos(-M) - d, i.lam = Math.atan2(g, u), this.face === C.RIGHT ? i.lam = _t(i.lam, -d) : this.face === C.BACK ? i.lam = _t(i.lam, -R) : this.face === C.LEFT && (i.lam = _t(i.lam, +d));
  }
  if (this.es !== 0) {
    var c, v, E;
    c = i.phi < 0 ? 1 : 0, v = Math.tan(i.phi), E = this.b / Math.sqrt(v * v + this.one_minus_f_squared), i.phi = Math.atan(Math.sqrt(this.a * this.a - E * E) / (this.one_minus_f * E)), c && (i.phi = -i.phi);
  }
  return i.lam += this.long0, t.x = i.lam, t.y = i.phi, t;
}
function qt(t, i, a, s) {
  var e;
  return t < m ? (s.value = A.AREA_0, e = 0) : (e = Math.atan2(i, a), Math.abs(e) <= b ? s.value = A.AREA_0 : e > b && e <= d + b ? (s.value = A.AREA_1, e -= d) : e > d + b || e <= -(d + b) ? (s.value = A.AREA_2, e = e >= 0 ? e - R : e + R) : (s.value = A.AREA_3, e += d)), e;
}
function _t(t, i) {
  var a = t + i;
  return a < -R ? a += xt : a > +R && (a -= xt), a;
}
var Oh = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
const Lh = {
  init: Rh,
  forward: Th,
  inverse: ph,
  names: Oh
};
var ni = [
  [1, 22199e-21, -715515e-10, 31103e-10],
  [0.9986, -482243e-9, -24897e-9, -13309e-10],
  [0.9954, -83103e-8, -448605e-10, -986701e-12],
  [0.99, -135364e-8, -59661e-9, 36777e-10],
  [0.9822, -167442e-8, -449547e-11, -572411e-11],
  [0.973, -214868e-8, -903571e-10, 18736e-12],
  [0.96, -305085e-8, -900761e-10, 164917e-11],
  [0.9427, -382792e-8, -653386e-10, -26154e-10],
  [0.9216, -467746e-8, -10457e-8, 481243e-11],
  [0.8962, -536223e-8, -323831e-10, -543432e-11],
  [0.8679, -609363e-8, -113898e-9, 332484e-11],
  [0.835, -698325e-8, -640253e-10, 934959e-12],
  [0.7986, -755338e-8, -500009e-10, 935324e-12],
  [0.7597, -798324e-8, -35971e-9, -227626e-11],
  [0.7186, -851367e-8, -701149e-10, -86303e-10],
  [0.6732, -986209e-8, -199569e-9, 191974e-10],
  [0.6213, -0.010418, 883923e-10, 624051e-11],
  [0.5722, -906601e-8, 182e-6, 624051e-11],
  [0.5322, -677797e-8, 275608e-9, 624051e-11]
], mt = [
  [-520417e-23, 0.0124, 121431e-23, -845284e-16],
  [0.062, 0.0124, -126793e-14, 422642e-15],
  [0.124, 0.0124, 507171e-14, -160604e-14],
  [0.186, 0.0123999, -190189e-13, 600152e-14],
  [0.248, 0.0124002, 710039e-13, -224e-10],
  [0.31, 0.0123992, -264997e-12, 835986e-13],
  [0.372, 0.0124029, 988983e-12, -311994e-12],
  [0.434, 0.0123893, -369093e-11, -435621e-12],
  [0.4958, 0.0123198, -102252e-10, -345523e-12],
  [0.5571, 0.0121916, -154081e-10, -582288e-12],
  [0.6176, 0.0119938, -241424e-10, -525327e-12],
  [0.6769, 0.011713, -320223e-10, -516405e-12],
  [0.7346, 0.0113541, -397684e-10, -609052e-12],
  [0.7903, 0.0109107, -489042e-10, -104739e-11],
  [0.8435, 0.0103431, -64615e-9, -140374e-14],
  [0.8936, 969686e-8, -64636e-9, -8547e-9],
  [0.9394, 840947e-8, -192841e-9, -42106e-10],
  [0.9761, 616527e-8, -256e-6, -42106e-10],
  [1, 328947e-8, -319159e-9, -42106e-10]
], ga = 0.8487, va = 1.3523, da = k / 5, qh = 1 / da, lt = 18, Wt = function(t, i) {
  return t[0] + i * (t[1] + i * (t[2] + i * t[3]));
}, Uh = function(t, i) {
  return t[1] + i * (2 * t[2] + i * 3 * t[3]);
};
function Dh(t, i, a, s) {
  for (var e = i; s; --s) {
    var r = t(e);
    if (e -= r, Math.abs(r) < a)
      break;
  }
  return e;
}
function kh() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.es = 0, this.title = this.title || "Robinson";
}
function Fh(t) {
  var i = y(t.x - this.long0, this.over), a = Math.abs(t.y), s = Math.floor(a * da);
  s < 0 ? s = 0 : s >= lt && (s = lt - 1), a = k * (a - qh * s);
  var e = {
    x: Wt(ni[s], a) * i,
    y: Wt(mt[s], a)
  };
  return t.y < 0 && (e.y = -e.y), e.x = e.x * this.a * ga + this.x0, e.y = e.y * this.a * va + this.y0, t.z !== void 0 && (e.z = t.z), t.m !== void 0 && (e.m = t.m), e;
}
function $h(t) {
  var i = {
    x: (t.x - this.x0) / (this.a * ga),
    y: Math.abs(t.y - this.y0) / (this.a * va)
  };
  if (i.y >= 1)
    i.x /= ni[lt][0], i.y = t.y < 0 ? -d : d;
  else {
    var a = Math.floor(i.y * lt);
    for (a < 0 ? a = 0 : a >= lt && (a = lt - 1); ; )
      if (mt[a][0] > i.y)
        --a;
      else if (mt[a + 1][0] <= i.y)
        ++a;
      else
        break;
    var s = mt[a], e = 5 * (i.y - s[0]) / (mt[a + 1][0] - s[0]);
    e = Dh(function(r) {
      return (Wt(s, r) - i.y) / Uh(s, r);
    }, e, m, 100), i.x /= Wt(ni[a], e), i.y = (5 * a + e) * I, t.y < 0 && (i.y = -i.y);
  }
  return i.x = y(i.x + this.long0, this.over), t.z !== void 0 && (i.z = t.z), t.m !== void 0 && (i.m = t.m), i;
}
var zh = ["Robinson", "robin"];
const Bh = {
  init: kh,
  forward: Fh,
  inverse: $h,
  names: zh
};
function jh() {
  this.name = "geocent";
}
function Wh(t) {
  var i = ia(t, this.es, this.a);
  return i;
}
function Hh(t) {
  var i = aa(t, this.es, this.a, this.b);
  return i;
}
var Qh = ["Geocentric", "geocentric", "geocent", "Geocent"];
const Kh = {
  init: jh,
  forward: Wh,
  inverse: Hh,
  names: Qh
};
var L = {
  N_POLE: 0,
  S_POLE: 1,
  EQUIT: 2,
  OBLIQ: 3
}, gt = {
  h: { def: 1e5, num: !0 },
  // default is Karman line, no default in PROJ.7
  azi: { def: 0, num: !0, degrees: !0 },
  // default is North
  tilt: { def: 0, num: !0, degrees: !0 },
  // default is Nadir
  long0: { def: 0, num: !0 },
  // default is Greenwich, conversion to rad is automatic
  lat0: { def: 0, num: !0 }
  // default is Equator, conversion to rad is automatic
};
function Vh() {
  if (Object.keys(gt).forEach((function(a) {
    if (typeof this[a] > "u")
      this[a] = gt[a].def;
    else {
      if (gt[a].num && isNaN(this[a]))
        throw new Error("Invalid parameter value, must be numeric " + a + " = " + this[a]);
      gt[a].num && (this[a] = parseFloat(this[a]));
    }
    gt[a].degrees && (this[a] = this[a] * I);
  }).bind(this)), Math.abs(Math.abs(this.lat0) - d) < m ? this.mode = this.lat0 < 0 ? L.S_POLE : L.N_POLE : Math.abs(this.lat0) < m ? this.mode = L.EQUIT : (this.mode = L.OBLIQ, this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0)), this.pn1 = this.h / this.a, this.pn1 <= 0 || this.pn1 > 1e10)
    throw new Error("Invalid height");
  this.p = 1 + this.pn1, this.rp = 1 / this.p, this.h1 = 1 / this.pn1, this.pfact = (this.p + 1) * this.h1, this.es = 0;
  var t = this.tilt, i = this.azi;
  this.cg = Math.cos(i), this.sg = Math.sin(i), this.cw = Math.cos(t), this.sw = Math.sin(t);
}
function Xh(t) {
  t.x -= this.long0;
  var i = Math.sin(t.y), a = Math.cos(t.y), s = Math.cos(t.x), e, r;
  switch (this.mode) {
    case L.OBLIQ:
      r = this.sinph0 * i + this.cosph0 * a * s;
      break;
    case L.EQUIT:
      r = a * s;
      break;
    case L.S_POLE:
      r = -i;
      break;
    case L.N_POLE:
      r = i;
      break;
  }
  switch (r = this.pn1 / (this.p - r), e = r * a * Math.sin(t.x), this.mode) {
    case L.OBLIQ:
      r *= this.cosph0 * i - this.sinph0 * a * s;
      break;
    case L.EQUIT:
      r *= i;
      break;
    case L.N_POLE:
      r *= -(a * s);
      break;
    case L.S_POLE:
      r *= a * s;
      break;
  }
  var n, h;
  return n = r * this.cg + e * this.sg, h = 1 / (n * this.sw * this.h1 + this.cw), e = (e * this.cg - r * this.sg) * this.cw * h, r = n * h, t.x = e * this.a, t.y = r * this.a, t;
}
function Jh(t) {
  t.x /= this.a, t.y /= this.a;
  var i = { x: t.x, y: t.y }, a, s, e;
  e = 1 / (this.pn1 - t.y * this.sw), a = this.pn1 * t.x * e, s = this.pn1 * t.y * this.cw * e, t.x = a * this.cg + s * this.sg, t.y = s * this.cg - a * this.sg;
  var r = D(t.x, t.y);
  if (Math.abs(r) < m)
    i.x = 0, i.y = t.y;
  else {
    var n, h;
    switch (h = 1 - r * r * this.pfact, h = (this.p - Math.sqrt(h)) / (this.pn1 / r + r / this.pn1), n = Math.sqrt(1 - h * h), this.mode) {
      case L.OBLIQ:
        i.y = Math.asin(n * this.sinph0 + t.y * h * this.cosph0 / r), t.y = (n - this.sinph0 * Math.sin(i.y)) * r, t.x *= h * this.cosph0;
        break;
      case L.EQUIT:
        i.y = Math.asin(t.y * h / r), t.y = n * r, t.x *= h;
        break;
      case L.N_POLE:
        i.y = Math.asin(n), t.y = -t.y;
        break;
      case L.S_POLE:
        i.y = -Math.asin(n);
        break;
    }
    i.x = Math.atan2(t.x, t.y);
  }
  return t.x = i.x + this.long0, t.y = i.y, t;
}
var Zh = ["Tilted_Perspective", "tpers"];
const Yh = {
  init: Vh,
  forward: Xh,
  inverse: Jh,
  names: Zh
};
function tn() {
  if (this.flip_axis = this.sweep === "x" ? 1 : 0, this.h = Number(this.h), this.radius_g_1 = this.h / this.a, this.radius_g_1 <= 0 || this.radius_g_1 > 1e10)
    throw new Error();
  if (this.radius_g = 1 + this.radius_g_1, this.C = this.radius_g * this.radius_g - 1, this.es !== 0) {
    var t = 1 - this.es, i = 1 / t;
    this.radius_p = Math.sqrt(t), this.radius_p2 = t, this.radius_p_inv2 = i, this.shape = "ellipse";
  } else
    this.radius_p = 1, this.radius_p2 = 1, this.radius_p_inv2 = 1, this.shape = "sphere";
  this.title || (this.title = "Geostationary Satellite View");
}
function an(t) {
  var i = t.x, a = t.y, s, e, r, n;
  if (i = i - this.long0, this.shape === "ellipse") {
    a = Math.atan(this.radius_p2 * Math.tan(a));
    var h = this.radius_p / D(this.radius_p * Math.cos(a), Math.sin(a));
    if (e = h * Math.cos(i) * Math.cos(a), r = h * Math.sin(i) * Math.cos(a), n = h * Math.sin(a), (this.radius_g - e) * e - r * r - n * n * this.radius_p_inv2 < 0)
      return t.x = Number.NaN, t.y = Number.NaN, t;
    s = this.radius_g - e, this.flip_axis ? (t.x = this.radius_g_1 * Math.atan(r / D(n, s)), t.y = this.radius_g_1 * Math.atan(n / s)) : (t.x = this.radius_g_1 * Math.atan(r / s), t.y = this.radius_g_1 * Math.atan(n / D(r, s)));
  } else this.shape === "sphere" && (s = Math.cos(a), e = Math.cos(i) * s, r = Math.sin(i) * s, n = Math.sin(a), s = this.radius_g - e, this.flip_axis ? (t.x = this.radius_g_1 * Math.atan(r / D(n, s)), t.y = this.radius_g_1 * Math.atan(n / s)) : (t.x = this.radius_g_1 * Math.atan(r / s), t.y = this.radius_g_1 * Math.atan(n / D(r, s))));
  return t.x = t.x * this.a, t.y = t.y * this.a, t;
}
function sn(t) {
  var i = -1, a = 0, s = 0, e, r, n, h;
  if (t.x = t.x / this.a, t.y = t.y / this.a, this.shape === "ellipse") {
    this.flip_axis ? (s = Math.tan(t.y / this.radius_g_1), a = Math.tan(t.x / this.radius_g_1) * D(1, s)) : (a = Math.tan(t.x / this.radius_g_1), s = Math.tan(t.y / this.radius_g_1) * D(1, a));
    var o = s / this.radius_p;
    if (e = a * a + o * o + i * i, r = 2 * this.radius_g * i, n = r * r - 4 * e * this.C, n < 0)
      return t.x = Number.NaN, t.y = Number.NaN, t;
    h = (-r - Math.sqrt(n)) / (2 * e), i = this.radius_g + h * i, a *= h, s *= h, t.x = Math.atan2(a, i), t.y = Math.atan(s * Math.cos(t.x) / i), t.y = Math.atan(this.radius_p_inv2 * Math.tan(t.y));
  } else if (this.shape === "sphere") {
    if (this.flip_axis ? (s = Math.tan(t.y / this.radius_g_1), a = Math.tan(t.x / this.radius_g_1) * Math.sqrt(1 + s * s)) : (a = Math.tan(t.x / this.radius_g_1), s = Math.tan(t.y / this.radius_g_1) * Math.sqrt(1 + a * a)), e = a * a + s * s + i * i, r = 2 * this.radius_g * i, n = r * r - 4 * e * this.C, n < 0)
      return t.x = Number.NaN, t.y = Number.NaN, t;
    h = (-r - Math.sqrt(n)) / (2 * e), i = this.radius_g + h * i, a *= h, s *= h, t.x = Math.atan2(a, i), t.y = Math.atan(s * Math.cos(t.x) / i);
  }
  return t.x = t.x + this.long0, t;
}
var en = ["Geostationary Satellite View", "Geostationary_Satellite", "geos"];
const rn = {
  init: tn,
  forward: an,
  inverse: sn,
  names: en
};
var St = 1.340264, wt = -0.081106, Pt = 893e-6, Gt = 3796e-6, Ht = Math.sqrt(3) / 2;
function hn() {
  this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.es !== 0 && (this.apa = ca(this.es), this.qp = W(this.e, 1), this.rqda = Math.sqrt(0.5 * this.qp));
}
function nn(t) {
  var i = y(t.x - this.long0, this.over), a = t.y, s = Math.sin(a);
  this.es !== 0 && (s = W(this.e, s) / this.qp);
  var e = Math.asin(Ht * s), r = e * e, n = r * r * r;
  return t.x = i * Math.cos(e) / (Ht * (St + 3 * wt * r + n * (7 * Pt + 9 * Gt * r))), t.y = e * (St + wt * r + n * (Pt + Gt * r)), this.es !== 0 && (t.x *= this.rqda, t.y *= this.rqda), t.x = this.a * t.x + this.x0, t.y = this.a * t.y + this.y0, t;
}
function on(t) {
  t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, this.es !== 0 && (t.x /= this.rqda, t.y /= this.rqda);
  var i = 1e-9, a = 12, s = t.y, e, r, n, h, o, l;
  for (l = 0; l < a && (e = s * s, r = e * e * e, n = s * (St + wt * e + r * (Pt + Gt * e)) - t.y, h = St + 3 * wt * e + r * (7 * Pt + 9 * Gt * e), s -= o = n / h, !(Math.abs(o) < i)); ++l)
    ;
  return e = s * s, r = e * e * e, t.x = Ht * t.x * (St + 3 * wt * e + r * (7 * Pt + 9 * Gt * e)) / Math.cos(s), t.y = Math.asin(Math.sin(s) / Ht), this.es !== 0 && (t.y = _a(t.y, this.apa)), t.x = y(t.x + this.long0, this.over), t;
}
var ln = ["eqearth", "Equal Earth", "Equal_Earth"];
const fn = {
  init: hn,
  forward: nn,
  inverse: on,
  names: ln
};
var Nt = 1e-10;
function cn() {
  var t;
  if (this.phi1 = this.lat1, Math.abs(this.phi1) < Nt)
    throw new Error();
  this.es ? (this.en = _i(this.es), this.m1 = Mt(
    this.phi1,
    this.am1 = Math.sin(this.phi1),
    t = Math.cos(this.phi1),
    this.en
  ), this.am1 = t / (Math.sqrt(1 - this.es * this.am1 * this.am1) * this.am1), this.inverse = un, this.forward = _n) : (Math.abs(this.phi1) + Nt >= d ? this.cphi1 = 0 : this.cphi1 = 1 / Math.tan(this.phi1), this.inverse = gn, this.forward = Mn);
}
function _n(t) {
  var i = y(t.x - (this.long0 || 0), this.over), a = t.y, s, e, r;
  return s = this.am1 + this.m1 - Mt(a, e = Math.sin(a), r = Math.cos(a), this.en), e = r * i / (s * Math.sqrt(1 - this.es * e * e)), t.x = s * Math.sin(e), t.y = this.am1 - s * Math.cos(e), t.x = this.a * t.x + (this.x0 || 0), t.y = this.a * t.y + (this.y0 || 0), t;
}
function un(t) {
  t.x = (t.x - (this.x0 || 0)) / this.a, t.y = (t.y - (this.y0 || 0)) / this.a;
  var i, a, s, e;
  if (a = D(t.x, t.y = this.am1 - t.y), e = ui(this.am1 + this.m1 - a, this.es, this.en), (i = Math.abs(e)) < d)
    i = Math.sin(e), s = a * Math.atan2(t.x, t.y) * Math.sqrt(1 - this.es * i * i) / Math.cos(e);
  else if (Math.abs(i - d) <= Nt)
    s = 0;
  else
    throw new Error();
  return t.x = y(s + (this.long0 || 0), this.over), t.y = Z(e), t;
}
function Mn(t) {
  var i = y(t.x - (this.long0 || 0), this.over), a = t.y, s, e;
  return e = this.cphi1 + this.phi1 - a, Math.abs(e) > Nt ? (t.x = e * Math.sin(s = i * Math.cos(a) / e), t.y = this.cphi1 - e * Math.cos(s)) : t.x = t.y = 0, t.x = this.a * t.x + (this.x0 || 0), t.y = this.a * t.y + (this.y0 || 0), t;
}
function gn(t) {
  t.x = (t.x - (this.x0 || 0)) / this.a, t.y = (t.y - (this.y0 || 0)) / this.a;
  var i, a, s = D(t.x, t.y = this.cphi1 - t.y);
  if (a = this.cphi1 + this.phi1 - s, Math.abs(a) > d)
    throw new Error();
  return Math.abs(Math.abs(a) - d) <= Nt ? i = 0 : i = s * Math.atan2(t.x, t.y) / Math.cos(a), t.x = y(i + (this.long0 || 0), this.over), t.y = Z(a), t;
}
var vn = ["bonne", "Bonne (Werner lat_1=90)"];
const dn = {
  init: cn,
  names: vn
}, Fi = {
  OBLIQUE: {
    forward: wn,
    inverse: Gn
  },
  TRANSVERSE: {
    forward: Pn,
    inverse: xn
  }
}, Qt = {
  ROTATE: {
    o_alpha: "oAlpha",
    o_lon_c: "oLongC",
    o_lat_c: "oLatC"
  },
  NEW_POLE: {
    o_lat_p: "oLatP",
    o_lon_p: "oLongP"
  },
  NEW_EQUATOR: {
    o_lon_1: "oLong1",
    o_lat_1: "oLat1",
    o_lon_2: "oLong2",
    o_lat_2: "oLat2"
  }
};
function mn() {
  if (this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.title = this.title || "General Oblique Transformation", this.isIdentity = Ji.includes(this.o_proj), !this.o_proj)
    throw new Error("Missing parameter: o_proj");
  if (this.o_proj === "ob_tran")
    throw new Error("Invalid value for o_proj: " + this.o_proj);
  const t = this.projStr.replace("+proj=ob_tran", "").replace("+o_proj=", "+proj=").trim(), i = B(t);
  if (!i)
    throw new Error("Invalid parameter: o_proj. Unknown projection " + this.o_proj);
  i.long0 = 0, this.obliqueProjection = i;
  let a;
  const s = Object.keys(Qt), e = (h) => {
    if (typeof this[h] > "u")
      return;
    const o = parseFloat(this[h]) * I;
    if (isNaN(o))
      throw new Error("Invalid value for " + h + ": " + this[h]);
    return o;
  };
  for (let h = 0; h < s.length; h++) {
    const o = s[h], l = Qt[o], _ = Object.entries(l);
    if (_.some(
      ([u]) => typeof this[u] < "u"
    )) {
      a = l;
      for (let u = 0; u < _.length; u++) {
        const [g, M] = _[u], c = e(g);
        if (typeof c > "u")
          throw new Error("Missing parameter: " + g + ".");
        this[M] = c;
      }
      break;
    }
  }
  if (!a)
    throw new Error("No valid parameters provided for ob_tran projection.");
  const { lamp: r, phip: n } = Sn(this, a);
  this.lamp = r, Math.abs(n) > m ? (this.cphip = Math.cos(n), this.sphip = Math.sin(n), this.projectionType = Fi.OBLIQUE) : this.projectionType = Fi.TRANSVERSE;
}
function yn(t) {
  return this.projectionType.forward(this, t);
}
function En(t) {
  return this.projectionType.inverse(this, t);
}
function Sn(t, i) {
  let a, s;
  if (i === Qt.ROTATE) {
    let e = t.oLongC, r = t.oLatC, n = t.oAlpha;
    if (Math.abs(Math.abs(r) - d) <= m)
      throw new Error("Invalid value for o_lat_c: " + t.o_lat_c + " should be < 90°");
    s = e + Math.atan2(-1 * Math.cos(n), -1 * Math.sin(n) * Math.sin(r)), a = Math.asin(Math.cos(r) * Math.sin(n));
  } else if (i === Qt.NEW_POLE)
    s = t.oLongP, a = t.oLatP;
  else {
    let e = t.oLong1, r = t.oLat1, n = t.oLong2, h = t.oLat2, o = Math.abs(r);
    if (Math.abs(r) > d - m)
      throw new Error("Invalid value for o_lat_1: " + t.o_lat_1 + " should be < 90°");
    if (Math.abs(h) > d - m)
      throw new Error("Invalid value for o_lat_2: " + t.o_lat_2 + " should be < 90°");
    if (Math.abs(r - h) < m)
      throw new Error("Invalid value for o_lat_1 and o_lat_2: o_lat_1 should be different from o_lat_2");
    if (o < m)
      throw new Error("Invalid value for o_lat_1: o_lat_1 should be different from zero");
    s = Math.atan2(
      Math.cos(r) * Math.sin(h) * Math.cos(e) - Math.sin(r) * Math.cos(h) * Math.cos(n),
      Math.sin(r) * Math.cos(h) * Math.sin(n) - Math.cos(r) * Math.sin(h) * Math.sin(e)
    ), a = Math.atan(-1 * Math.cos(s - e) / Math.tan(r));
  }
  return { lamp: s, phip: a };
}
function wn(t, i) {
  let { x: a, y: s } = i;
  a = y(a - t.long0, t.over);
  const e = Math.cos(a), r = Math.sin(s), n = Math.cos(s);
  i.x = y(
    Math.atan2(
      n * Math.sin(a),
      t.sphip * n * e + t.cphip * r
    ) + t.lamp
  ), i.y = Math.asin(
    t.sphip * r - t.cphip * n * e
  );
  const h = t.obliqueProjection.forward(i);
  return t.isIdentity && (h.x *= k, h.y *= k), h;
}
function Pn(t, i) {
  let { x: a, y: s } = i;
  a = y(a - t.long0, t.over);
  const e = Math.cos(s), r = Math.cos(a);
  i.x = y(
    Math.atan2(
      e * Math.sin(a),
      Math.sin(s)
    ) + t.lamp
  ), i.y = Math.asin(-1 * e * r);
  const n = t.obliqueProjection.forward(i);
  return t.isIdentity && (n.x *= k, n.y *= k), n;
}
function Gn(t, i) {
  t.isIdentity && (i.x *= I, i.y *= I);
  const a = t.obliqueProjection.inverse(i);
  let { x: s, y: e } = a;
  if (s < Number.MAX_VALUE) {
    s -= t.lamp;
    const r = Math.cos(s), n = Math.sin(e), h = Math.cos(e);
    i.x = Math.atan2(
      h * Math.sin(s),
      t.sphip * h * r - t.cphip * n
    ), i.y = Math.asin(
      t.sphip * n + t.cphip * h * r
    );
  }
  return i.x = y(i.x + t.long0), i;
}
function xn(t, i) {
  t.isIdentity && (i.x *= I, i.y *= I);
  const a = t.obliqueProjection.inverse(i);
  let { x: s, y: e } = a;
  if (s < Number.MAX_VALUE) {
    const r = Math.cos(e);
    s -= t.lamp, i.x = Math.atan2(
      r * Math.sin(s),
      -1 * Math.sin(e)
    ), i.y = Math.asin(
      r * Math.cos(s)
    );
  }
  return i.x = y(i.x + t.long0), i;
}
var bn = ["General Oblique Transformation", "General_Oblique_Transformation", "ob_tran"];
const An = {
  init: mn,
  forward: yn,
  inverse: En,
  names: bn
};
function Nn(t) {
  t.Proj.projections.add(Dt), t.Proj.projections.add(kt), t.Proj.projections.add(ue), t.Proj.projections.add(we), t.Proj.projections.add(Ae), t.Proj.projections.add(Te), t.Proj.projections.add(De), t.Proj.projections.add(Be), t.Proj.projections.add(Ke), t.Proj.projections.add(Ye), t.Proj.projections.add(fr), t.Proj.projections.add(vr), t.Proj.projections.add(Sr), t.Proj.projections.add(Ar), t.Proj.projections.add(Tr), t.Proj.projections.add(Ur), t.Proj.projections.add(Br), t.Proj.projections.add(Kr), t.Proj.projections.add(Zr), t.Proj.projections.add(sh), t.Proj.projections.add(oh), t.Proj.projections.add(uh), t.Proj.projections.add(mh), t.Proj.projections.add(xh), t.Proj.projections.add(Ch), t.Proj.projections.add(Lh), t.Proj.projections.add(Bh), t.Proj.projections.add(Kh), t.Proj.projections.add(Yh), t.Proj.projections.add(rn), t.Proj.projections.add(fn), t.Proj.projections.add(dn), t.Proj.projections.add(An);
}
const In = Object.assign(Cs, {
  defaultDatum: "WGS84",
  Proj: B,
  WGS84: new B("WGS84"),
  Point: ut,
  toPoint: fi,
  defs: p,
  nadgrid: ls,
  transform: Is,
  mgrs: Rs,
  version: "__VERSION__"
});
Nn(In);
export {
  In as default
};
//# sourceMappingURL=index-BB4XdSO8.js.map
