// IIIF の Manifest の書誌を、地図の metadata の鍵へ写すための関数。
//
// 設計の要点:
//   - ここでは Manifest を取りに行かない。呼び出し側が読んだ JSON（JSON.parse 済みの値）を渡す。
//   - OpenLayers・画面の DOM・通信に依存しない（Node からも Editor の主処理からも読める）。
//   - HTML として写す値の洗浄は、呼び出し側が渡す関数に任せる。この中で画面の DOM を使わないため。
//   - 版（Presentation API の 2／3）で読む項目の名前が違うので、名寄せはここで行う。
import type { Localized } from "../element_contract";

/** 写す元（Manifest そのものか、選んだ canvas か） */
export type IiifFrom = "manifest" | "canvas";

/** 写す元にする IIIF の項目 */
export type IiifProperty = "label" | "summary" | "requiredStatement" | "rights" | "provider";

/** 地図の metadata の鍵 1 つと、その写す元の結び付け */
export interface IiifBindingSelector {
  from: IiifFrom;
  property: IiifProperty;
}

/**
 * 結び付けられる鍵 → IIIF の項目の既定の対応。
 * Editor はこれを読んで「写す鍵」の欄を作り、対応を自分で書かない。
 * ライセンスの注記（licenseNote・dataLicenseNote）は license・dataLicense に付いて動くので入れない。
 */
export const IIIF_BINDABLE_KEYS: Readonly<Record<string, IiifProperty>> = {
  title: "label",
  officialTitle: "label",
  attr: "requiredStatement",
  dataAttr: "requiredStatement",
  license: "rights",
  dataLicense: "rights",
  description: "summary",
  contributor: "provider"
};

/** 写す鍵 → 写す元（鍵が許可されているものに限る） */
export type IiifBindings = Partial<Record<string, IiifBindingSelector>>;

/** 地図データの iiif 節 */
export interface MaplatIiifSection {
  manifest?: string;
  canvas?: string;
  image?: string;
  bindings?: IiifBindings;
  copiedAt?: string;
  /** 鍵 → 言語 → 写した時点の値 */
  copiedValues?: Record<string, Record<string, string>>;
  copiedMetadata?: IiifMetadataEntry[];
}

/** 写した metadata の 1 行 */
export interface IiifMetadataEntry {
  from: IiifFrom;
  label: Localized;
  value: Localized;
}

/** 書誌の表の出し方（アプリの設定で選ぶ） */
export type IiifMetadataDisplay = "all" | "hidden";

/** アプリの設定が無いときに使う、書誌の表の出し方 */
export const IIIF_METADATA_DISPLAY_DEFAULT = "hidden";

/** 言語の表で、言語を持たない値を入れる場所（Presentation API の none） */
const NONE = "none";

/** 言語ごとに HTML として入る鍵（それ以外の鍵は文字として入る） */
const HTML_KEYS = new Set(["attr", "dataAttr", "description", "contributor"]);

/** 文字として入る鍵（title・officialTitle）の値のつなぎ方 */
const TEXT_JOINER = " / ";
/** HTML として入る鍵と metadata の値のつなぎ方 */
const HTML_JOINER = "<br>";

/** Creative Commons の URI の道 → ライセンスの語彙（綴りは UI のライセンスの一覧に合わせる） */
const CREATIVE_COMMONS: Array<{ pattern: RegExp; license: string }> = [
  { pattern: /^\/licenses\/by-nc-sa(\/|$)/i, license: "CC BY-NC-SA" },
  { pattern: /^\/licenses\/by-nc-nd(\/|$)/i, license: "CC BY-NC-ND" },
  { pattern: /^\/licenses\/by-sa(\/|$)/i, license: "CC BY-SA" },
  { pattern: /^\/licenses\/by-nd(\/|$)/i, license: "CC BY-ND" },
  { pattern: /^\/licenses\/by-nc(\/|$)/i, license: "CC BY-NC" },
  { pattern: /^\/licenses\/by(\/|$)/i, license: "CC BY" },
  { pattern: /^\/publicdomain\/zero(\/|$)/i, license: "CC0" },
  { pattern: /^\/publicdomain\/mark(\/|$)/i, license: "PD" }
];

type PlainObject = Record<string, any>;

type ParsedManifest = {
  ok: true;
  version: "2" | "3";
  root: PlainObject;
  canvases: PlainObject[];
};

type ParseFailure = { ok: false; reason: "not-manifest" | "unsupported-version" };

type Version = "2" | "3";

/** canvas の一覧の 1 枚 */
type IiifCanvasSummary = {
  id: string;
  label: Localized;
  width: number;
  height: number;
  imageService?: string;
};

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwn(table: PlainObject, key: string) {
  return Object.prototype.hasOwnProperty.call(table, key);
}

/** 値を文字列の配列として読む（文字列 1 つ・文字列の配列のどちらも受ける） */
function joinValues(values: unknown, joiner: string): string | undefined {
  if (typeof values === "string") return values;
  if (Array.isArray(values)) {
    const parts: string[] = [];
    for (const value of values) if (typeof value === "string") parts.push(value);
    return parts.join(joiner);
  }
  return undefined;
}

/**
 * IIIF の値を 言語 → 文字列 の表にする。
 * 版 2 の文字列はそのまま文字列で返し、言語つきの値の並び・版 3 の言語の表は表で返す。
 * 読めない形なら undefined。
 */
function toLocalized(raw: unknown, joiner: string): Localized | undefined {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) {
    const table: Record<string, string> = {};
    for (const item of raw) {
      const single = toLocalized(item, joiner);
      if (single === undefined) continue;
      const pairs: Array<[string, string]> =
        typeof single === "string" ? [[NONE, single]] : Object.entries(single);
      for (const [language, text] of pairs) {
        table[language] = hasOwn(table, language) ? `${table[language]}${joiner}${text}` : text;
      }
    }
    return Object.keys(table).length > 0 ? table : undefined;
  }
  if (!isPlainObject(raw)) return undefined;
  // 版 2 の言語つきの値
  if (typeof raw["@value"] === "string") {
    const language = raw["@language"];
    const key = typeof language === "string" && language ? language : NONE;
    return { [key]: raw["@value"] };
  }
  // 版 3 の言語の表
  const table: Record<string, string> = {};
  for (const [language, values] of Object.entries(raw)) {
    if (language.startsWith("@")) continue;
    const joined = joinValues(values, joiner);
    if (joined !== undefined) table[language] = joined;
  }
  return Object.keys(table).length > 0 ? table : undefined;
}

/** none を lang の値として使い、ほかの言語の値はそのまま残す（値の読み方） */
function localizeTable(table: Record<string, string>, lang: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [language, text] of Object.entries(table)) {
    if (language !== NONE) out[language] = text;
  }
  const none = table[NONE];
  // none は lang の値が無いときだけ lang の値として使う
  if (none !== undefined && !hasOwn(out, lang)) out[lang] = none;
  return out;
}

/** 値（本文）の読み方 */
function localizeValue(raw: unknown, joiner: string, lang: string): Localized | undefined {
  const converted = toLocalized(raw, joiner);
  if (converted === undefined) return undefined;
  if (typeof converted === "string") return converted;
  return localizeTable(converted, lang);
}

/**
 * 項目名（metadata の label）の読み方。
 * lang の値があれば言語ごとの表をそのまま返し、無くて none があればその値を lang の値として 1 つ返す。
 */
function localizeLabel(raw: unknown, joiner: string, lang: string): Localized | undefined {
  const converted = toLocalized(raw, joiner);
  if (converted === undefined) return undefined;
  if (typeof converted === "string") return converted;
  const others: Record<string, string> = {};
  for (const [language, text] of Object.entries(converted)) {
    if (language !== NONE) others[language] = text;
  }
  if (hasOwn(others, lang)) return others;
  const none = converted[NONE];
  if (none !== undefined) return { [lang]: none };
  return Object.keys(others).length > 0 ? others : undefined;
}

/** 言語の表の値を、言語ごとに洗浄する */
function sanitizeLocalized(value: Localized, sanitize: (html: string) => string): Localized {
  if (typeof value === "string") return sanitize(value);
  const out: Record<string, string> = {};
  for (const [language, text] of Object.entries(value)) out[language] = sanitize(text);
  return out;
}

/** @context から Presentation API の版を読む */
function detectVersion(root: PlainObject): Version | undefined {
  const context = root["@context"];
  const contexts = typeof context === "string" ? [context] : Array.isArray(context) ? context : [];
  const joined = contexts.filter((item): item is string => typeof item === "string").join(" ");
  if (joined.includes("presentation/2")) return "2";
  if (joined.includes("presentation/3")) return "3";
  return undefined;
}

function sequencesCanvases(root: PlainObject): PlainObject[] | undefined {
  const sequences = root.sequences;
  if (!Array.isArray(sequences)) return undefined;
  if (sequences.length === 0) return [];
  const first = sequences[0];
  if (!isPlainObject(first) || !Array.isArray(first.canvases)) return undefined;
  return first.canvases.filter(isPlainObject);
}

function parseManifest(input: unknown): ParsedManifest | ParseFailure {
  if (!isPlainObject(input)) return { ok: false, reason: "not-manifest" };
  const version = detectVersion(input);
  if (version === undefined) return { ok: false, reason: "unsupported-version" };
  if (version === "2") {
    const canvases = sequencesCanvases(input);
    if (canvases === undefined) return { ok: false, reason: "not-manifest" };
    return { ok: true, version, root: input, canvases };
  }
  const items = input.items;
  if (!Array.isArray(items)) return { ok: false, reason: "not-manifest" };
  return { ok: true, version, root: input, canvases: items.filter(isPlainObject) };
}

/** canvas の id（版 2 は @id、版 3 は id） */
function canvasIdOf(canvas: PlainObject, version: Version): string | undefined {
  const id = version === "2" ? canvas["@id"] : canvas.id;
  return typeof id === "string" ? id : undefined;
}

function findCanvas(parsed: ParsedManifest, canvasId: string | undefined): PlainObject | undefined {
  if (!canvasId) return undefined;
  return parsed.canvases.find(canvas => canvasIdOf(canvas, parsed.version) === canvasId);
}

/** canvas の label を、言語を選ばずに読む（数字だけかの判定と一覧の表示に使う） */
function canvasLabel(canvas: PlainObject | undefined): Localized {
  if (!canvas) return "";
  const converted = toLocalized(canvas.label, TEXT_JOINER);
  if (converted === undefined) return "";
  if (typeof converted === "string") return converted;
  const others: Record<string, string> = {};
  for (const [language, text] of Object.entries(converted)) {
    if (language !== NONE) others[language] = text;
  }
  if (Object.keys(others).length > 0) return others;
  return converted[NONE] ?? "";
}

/** label が数字だけか（1 枚ものの地図で、canvas の label が頁の番号になっている場合を見分ける） */
function isNumericLabel(label: Localized): boolean {
  const texts = typeof label === "string" ? [label] : Object.values(label);
  if (texts.length === 0) return false;
  return texts.every(text => /^[0-9]+$/.test(text.trim()));
}

/** 版 2 の画像サービス（canvas.images[0].resource.service）の id */
function v2ImageService(canvas: PlainObject): string | undefined {
  const images = canvas.images;
  if (!Array.isArray(images) || !isPlainObject(images[0])) return undefined;
  const resource = images[0].resource;
  if (!isPlainObject(resource)) return undefined;
  const service = Array.isArray(resource.service) ? resource.service[0] : resource.service;
  if (!isPlainObject(service)) return undefined;
  const id = service["@id"];
  return typeof id === "string" ? id : undefined;
}

/** 版 3 の画像サービス（canvas.items[0].items[0].body.service）の id */
function v3ImageService(canvas: PlainObject): string | undefined {
  const pages = canvas.items;
  if (!Array.isArray(pages) || !isPlainObject(pages[0])) return undefined;
  const annotations = pages[0].items;
  if (!Array.isArray(annotations) || !isPlainObject(annotations[0])) return undefined;
  const body = annotations[0].body;
  if (!isPlainObject(body)) return undefined;
  const service = Array.isArray(body.service) ? body.service[0] : body.service;
  if (!isPlainObject(service)) return undefined;
  const id = service.id;
  return typeof id === "string" ? id : undefined;
}

/** 数を読む（読めなければ 0） */
function toSize(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** Manifest の canvas の一覧（Editor の canvas の選択に使う） */
export function listIiifCanvases(
  manifest: unknown
):
  | {
      ok: true;
      version: "2" | "3";
      canvases: Array<{
        id: string;
        label: Localized;
        width: number;
        height: number;
        imageService?: string;
      }>;
    }
  | { ok: false; reason: "not-manifest" | "unsupported-version" } {
  const parsed = parseManifest(manifest);
  if (!parsed.ok) return { ok: false, reason: parsed.reason };
  const canvases: IiifCanvasSummary[] = [];
  for (const canvas of parsed.canvases) {
    const id = canvasIdOf(canvas, parsed.version);
    if (id === undefined) continue;
    const imageService =
      parsed.version === "2" ? v2ImageService(canvas) : v3ImageService(canvas);
    const summary: IiifCanvasSummary = {
      id,
      label: canvasLabel(canvas),
      width: toSize(canvas.width),
      height: toSize(canvas.height)
    };
    if (imageService !== undefined) summary.imageService = imageService;
    canvases.push(summary);
  }
  return { ok: true, version: parsed.version, canvases };
}

/**
 * 既定の selector。
 * canvas の label が頁の番号（数字だけ）なら Manifest の label を、
 * そうでなければ canvas の label を指す。ほかの項目は Manifest から写す。
 */
export function proposeIiifBindings(manifest: unknown, canvasId: string): IiifBindings {
  const parsed = parseManifest(manifest);
  const canvas = parsed.ok ? findCanvas(parsed, canvasId) : undefined;
  const labelFrom: IiifFrom =
    canvas && !isNumericLabel(canvasLabel(canvas)) ? "canvas" : "manifest";
  return {
    title: { from: labelFrom, property: "label" },
    officialTitle: { from: labelFrom, property: "label" },
    attr: { from: "manifest", property: "requiredStatement" },
    dataAttr: { from: "manifest", property: "requiredStatement" },
    license: { from: "manifest", property: "rights" },
    dataLicense: { from: "manifest", property: "rights" },
    description: { from: "manifest", property: "summary" },
    contributor: { from: "manifest", property: "provider" }
  };
}

/** 写す元の項目（版 2・版 3 の名前の違いを名寄せする） */
function readProperty(
  source: PlainObject | undefined,
  property: IiifProperty,
  version: Version
): unknown {
  if (!source) return undefined;
  switch (property) {
    case "label":
      return source.label;
    case "summary":
      return version === "2" ? source.description : source.summary;
    case "requiredStatement":
      return version === "2" ? source.attribution : source.requiredStatement?.value;
    case "rights":
      return version === "2" ? source.license : source.rights;
    case "provider": {
      if (version === "2") return undefined;
      const provider = Array.isArray(source.provider) ? source.provider[0] : undefined;
      return isPlainObject(provider) ? provider.label : undefined;
    }
    default:
      return undefined;
  }
}

/** metadata の一覧を写した行にする（順を保ち、全部の行を返す） */
function collectMetadata(
  source: PlainObject | undefined,
  from: IiifFrom,
  lang: string,
  sanitize: (html: string) => string,
  warnings: string[]
): IiifMetadataEntry[] {
  if (!source || !Array.isArray(source.metadata)) return [];
  const entries: IiifMetadataEntry[] = [];
  for (const raw of source.metadata) {
    if (!isPlainObject(raw)) continue;
    const label = localizeLabel(raw.label, TEXT_JOINER, lang) ?? "";
    const localized = localizeValue(raw.value, HTML_JOINER, lang);
    if (localized === undefined) {
      warnings.push(`${from === "canvas" ? "canvas" : "Manifest"} の metadata の値の形が読めません`);
      continue;
    }
    entries.push({ from, label, value: sanitizeLocalized(localized, sanitize) });
  }
  return entries;
}

/**
 * 写す値を取り出す（取得しない）。
 * HTML として入る鍵の値と metadata の値は、呼び出し側が渡した関数（sanitize）を通してから返す。
 */
export function resolveIiifMetadata(
  manifest: unknown,
  iiif: Pick<MaplatIiifSection, "canvas" | "bindings">,
  lang: string,
  sanitize: (html: string) => string
):
  | {
      ok: true;
      version: "2" | "3";
      values: Record<string, Localized | string>;
      copiedValues: Record<string, Record<string, string>>;
      copiedMetadata: IiifMetadataEntry[];
      unresolved: string[];
      warnings: string[];
    }
  | { ok: false; reason: "not-manifest" | "unsupported-version" } {
  const parsed = parseManifest(manifest);
  if (!parsed.ok) return { ok: false, reason: parsed.reason };
  const canvas = findCanvas(parsed, iiif.canvas);
  const warnings: string[] = [];
  const unresolved: string[] = [];
  const values: Record<string, Localized | string> = {};
  let warnedMissingCanvas = false;

  for (const [key, selector] of Object.entries(iiif.bindings ?? {})) {
    const property = isPlainObject(selector) ? selector.property : undefined;
    const from = isPlainObject(selector) ? selector.from : undefined;
    if (IIIF_BINDABLE_KEYS[key] !== property) {
      unresolved.push(key);
      warnings.push(`鍵 ${key} に IIIF の項目 ${String(property)} は写せません`);
      continue;
    }
    if (from !== "manifest" && from !== "canvas") {
      unresolved.push(key);
      warnings.push(`鍵 ${key} の写す元 ${String(from)} は読めません`);
      continue;
    }
    if (from === "canvas" && !canvas) {
      unresolved.push(key);
      if (!warnedMissingCanvas) {
        warnings.push("指定された canvas が Manifest にありません");
        warnedMissingCanvas = true;
      }
      continue;
    }
    const raw = readProperty(from === "canvas" ? canvas : parsed.root, property, parsed.version);
    if (property === "rights") {
      if (typeof raw !== "string") {
        unresolved.push(key);
        warnings.push(`鍵 ${key} のライセンスの値の形が読めません`);
        continue;
      }
      const converted = iiifRightsToLicense(raw);
      values[key] = converted.license;
      const noteKey = key === "license" ? "licenseNote" : key === "dataLicense" ? "dataLicenseNote" : undefined;
      if (noteKey !== undefined && converted.licenseNote !== undefined) {
        values[noteKey] = converted.licenseNote;
      }
      continue;
    }
    const localized = localizeValue(raw, HTML_KEYS.has(key) ? HTML_JOINER : TEXT_JOINER, lang);
    if (localized === undefined) {
      unresolved.push(key);
      warnings.push(`鍵 ${key} の IIIF の値の形が読めません`);
      continue;
    }
    values[key] = HTML_KEYS.has(key) ? sanitizeLocalized(localized, sanitize) : localized;
  }

  const copiedMetadata: IiifMetadataEntry[] = [
    ...collectMetadata(parsed.root, "manifest", lang, sanitize, warnings),
    ...collectMetadata(canvas, "canvas", lang, sanitize, warnings)
  ];

  // values に入れたのと同じ文字列を、鍵 → 言語 → 文字列 の形でも返す
  const copiedValues: Record<string, Record<string, string>> = {};
  for (const [key, value] of Object.entries(values)) {
    copiedValues[key] = typeof value === "string" ? { [lang]: value } : { ...value };
  }

  return {
    ok: true,
    version: parsed.version,
    values,
    copiedValues,
    copiedMetadata,
    unresolved,
    warnings
  };
}

/**
 * copiedValues と比べて、鍵・言語ごとに「人が直した」「IIIF の側が変わった」を返す。
 * 人が直したかは今の値と写した時点の値で、IIIF の側が変わったかは写した時点の値と取り直した値で見る。
 * 今の IIIF の値と今の値を直接は比べない。取り直した値が無ければ IIIF の側が変わったかは判定しない。
 */
export function compareIiifCopy(
  current: Record<string, Localized | string | undefined>,
  copiedValues: Record<string, Record<string, string>>,
  fresh: Record<string, Record<string, string>> | undefined,
  lang: string
): Array<{ key: string; lang: string; humanEdited: boolean; iiifChanged: boolean | undefined }> {
  const rows: Array<{
    key: string;
    lang: string;
    humanEdited: boolean;
    iiifChanged: boolean | undefined;
  }> = [];
  for (const [key, table] of Object.entries(copiedValues ?? {})) {
    if (!table) continue;
    const currentValue = current?.[key];
    for (const [language, copied] of Object.entries(table)) {
      // 多言語でない鍵・文字列で写した値は、lang の言語の値として比べる
      const now =
        typeof currentValue === "string"
          ? language === lang
            ? currentValue
            : undefined
          : currentValue?.[language];
      const humanEdited = now === undefined || now !== copied;
      const iiifChanged = fresh === undefined ? undefined : fresh[key]?.[language] !== copied;
      rows.push({ key, lang: language, humanEdited, iiifChanged });
    }
  }
  return rows;
}

/** ライセンス（rights）の URI を、Maplat のライセンスの語彙にする */
export function iiifRightsToLicense(uri: string): { license: string; licenseNote?: string } {
  const path = uri.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  if (/^creativecommons\.org\//i.test(path)) {
    const within = path.slice("creativecommons.org".length);
    for (const { pattern, license } of CREATIVE_COMMONS) {
      if (pattern.test(within)) return { license };
    }
  }
  // 表に無い URI はそのまま注記に残す
  return { license: "Custom", licenseNote: uri };
}
