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
/** 入れ子の配列をたどる深さの上限（深い入れ子・循環する値で止まるため） */
const NESTED_ARRAY_MAX_DEPTH = 32;

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

/**
 * 配列の中の配列を深さ上限つきで平らにする。items は、配列でない要素と、
 * 深さ上限を超えた入れ子（それ以上たどらず 1 つの値として残す）。
 * 一度見た配列は seen（WeakSet）で飛ばすので、自分自身を含む（循環する）配列でも止まる。
 * seen はたどり終えた配列も覚えたままにする。同じ配列を兄弟に共有する値（[b, b]）は
 * 2 つ目を読まないが、JSON から作った manifest では共有も循環も起きない。たどり中の
 * 配列だけを覚える形にすると、共有を重ねた値で呼び出しが指数的に増えるため、こちらを採る。
 * truncated は、循環・深さ上限で読み落とした形が無いか（空と読めない形を分ける）。
 */
function flattenNestedArrays(
  values: readonly unknown[],
  seen: WeakSet<object>,
  depth: number
): { items: unknown[]; truncated: boolean } {
  const items: unknown[] = [];
  let truncated = false;
  for (const value of values) {
    if (!Array.isArray(value)) {
      items.push(value);
      continue;
    }
    if (seen.has(value)) {
      truncated = true;
      continue;
    }
    if (depth >= NESTED_ARRAY_MAX_DEPTH) {
      items.push(value);
      truncated = true;
      continue;
    }
    seen.add(value);
    const inner = flattenNestedArrays(value, seen, depth + 1);
    for (const item of inner.items) items.push(item);
    truncated = truncated || inner.truncated;
  }
  return { items, truncated };
}

/**
 * 値を文字列の配列として読む（文字列 1 つ・文字列の配列のどちらも受ける）。
 * 配列の中の配列も深さ上限つきで平らにして、中の文字列を読む。
 */
function joinValues(values: unknown, joiner: string): string | undefined {
  if (typeof values === "string") return values;
  if (Array.isArray(values)) {
    const seen = new WeakSet<object>();
    seen.add(values);
    const parts = flattenNestedArrays(values, seen, 0).items.filter(
      (value): value is string => typeof value === "string"
    );
    return parts.length > 0 ? parts.join(joiner) : undefined;
  }
  return undefined;
}

/**
 * 配列ではない IIIF の値を 言語 → 文字列 の表にする。
 * 版 2 の文字列はそのまま文字列で返し、言語つきの値・版 3 の言語の表は表で返す。
 * 読めない形なら undefined。
 */
function toLocalizedValue(raw: unknown, joiner: string): Localized | undefined {
  if (typeof raw === "string") return raw;
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

/**
 * IIIF の値を 言語 → 文字列 の表にする。
 * 配列は版 2 の「言語つきの値の並び」を読み、配列の中の配列も深さ上限つきで平らにして読む
 * （深い入れ子・自分自身を含む値でも止まるよう、深さ上限と一度見た配列を WeakSet で飛ばす）。
 * 読めない形なら undefined。
 */
function toLocalized(raw: unknown, joiner: string): Localized | undefined {
  if (!Array.isArray(raw)) return toLocalizedValue(raw, joiner);
  const seen = new WeakSet<object>();
  seen.add(raw);
  const items = flattenNestedArrays(raw, seen, 0).items;
  const table: Record<string, string> = {};
  for (const item of items) {
    const single = toLocalizedValue(item, joiner);
    if (single === undefined) continue;
    const pairs: Array<[string, string]> =
      typeof single === "string" ? [[NONE, single]] : Object.entries(single);
    for (const [language, text] of pairs) {
      table[language] = hasOwn(table, language) ? `${table[language]}${joiner}${text}` : text;
    }
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

/** canvas の label を、言語を選ばずに読む（一覧の表示に使う） */
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

/** 文字列 1 つ・配列のどちらでも、中の文字列だけを返す */
function stringsOf(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return [];
}

/**
 * サービスが画像サービスか。
 * 型（type／@type）があれば ImageService1〜3 だけを受け付ける。
 * 型を省いた従来の Image API 2 のサービスは、@context か profile に Image API の印
 * （iiif.io/api/image/ を含む URI、または level0〜level2）があるものだけを受け付ける。
 * 型の無い認証（/api/auth/）や annex のサービス（annex/services）は画像サービスと見なさない。
 */
function isImageService(service: PlainObject): boolean {
  const type = service.type ?? service["@type"];
  if (type !== undefined) return /^ImageService[123]$/.test(String(type));
  const marks = [...stringsOf(service["@context"]), ...stringsOf(service.profile)];
  if (marks.some(mark => mark.includes("/api/auth/") || mark.includes("annex/services"))) return false;
  return marks.some(mark => mark.includes("iiif.io/api/image/") || /^level[0-2]$/.test(mark));
}

/**
 * 画像サービスは Presentation の版とは独立して id／@id を持つ。
 * 複数候補は記載順に調べ、画像サービスでないもの・id が読めないものは飛ばす。
 */
function imageServiceId(raw: unknown): string | undefined {
  const services = Array.isArray(raw) ? raw : [raw];
  for (const service of services) {
    if (!isPlainObject(service) || !isImageService(service)) continue;
    for (const id of [service.id, service["@id"]]) {
      if (typeof id === "string" && id.trim() !== "") return id;
    }
  }
  return undefined;
}

/** 版 2 の画像サービス（canvas.images[0].resource.service）の id */
function v2ImageService(canvas: PlainObject): string | undefined {
  const images = canvas.images;
  if (!Array.isArray(images) || !isPlainObject(images[0])) return undefined;
  const resource = images[0].resource;
  if (!isPlainObject(resource)) return undefined;
  return imageServiceId(resource.service);
}

/** 版 3 の画像サービス（canvas.items[0].items[0].body.service）の id */
function v3ImageService(canvas: PlainObject): string | undefined {
  const pages = canvas.items;
  if (!Array.isArray(pages) || !isPlainObject(pages[0])) return undefined;
  const annotations = pages[0].items;
  if (!Array.isArray(annotations) || !isPlainObject(annotations[0])) return undefined;
  const body = annotations[0].body;
  if (!isPlainObject(body)) return undefined;
  return imageServiceId(body.service);
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

/** 既定で結び付ける鍵（題名は別に扱う） */
const DEFAULT_BINDINGS: ReadonlyArray<{ key: string; property: IiifProperty }> = [
  { key: "attr", property: "requiredStatement" },
  { key: "license", property: "rights" },
  { key: "description", property: "summary" }
];

/**
 * 既定の selector。
 * 題名は常に Manifest の label を指す。帰属・ライセンス・要約も Manifest から写す。
 * 結び付ける元にその項目が無い（読めない）ときは、その鍵を返さない。
 */
export function proposeIiifBindings(manifest: unknown, _canvasId: string): IiifBindings {
  const parsed = parseManifest(manifest);
  if (!parsed.ok) return {};
  const bindings: IiifBindings = {};
  if (isReadableProperty(parsed.root, "label", parsed.version, TEXT_JOINER)) {
    bindings.title = { from: "manifest", property: "label" };
  }
  for (const { key, property } of DEFAULT_BINDINGS) {
    if (isReadableProperty(parsed.root, property, parsed.version, HTML_JOINER)) {
      bindings[key] = { from: "manifest", property };
    }
  }
  return bindings;
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

/**
 * 値が入っていないか（undefined・null・空の文字列）。
 * 「その項目が無い」と「あるが形が読めない」を分けるために使う。
 */
function isMissingValue(raw: unknown): boolean {
  if (raw === undefined || raw === null) return true;
  return typeof raw === "string" && raw.trim() === "";
}

/** その項目の値を読めるか（読めない項目は既定では結び付けない） */
function isReadableProperty(
  source: PlainObject | undefined,
  property: IiifProperty,
  version: Version,
  joiner: string
): boolean {
  const raw = readProperty(source, property, version);
  if (isMissingValue(raw)) return false;
  if (property === "rights") return typeof raw === "string";
  const converted = toLocalized(raw, joiner);
  if (converted === undefined) return false;
  if (typeof converted === "string") return converted.trim() !== "";
  return Object.values(converted).some(text => text.trim() !== "");
}

/** 空白だけ・空の文字列か、値が無い（undefined・null） */
function isBlankText(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

/**
 * 言語の表の 1 言語の値が空か（空白だけの文字列、または空白だけの文字列しか無い配列）。
 * 配列の中の配列も深さ上限つきで平らにしてから中身を見る。循環・深さ上限で読み落とした
 * 形があるときは、空ではなく読めない値として扱う。
 */
function isBlankLanguageValues(values: unknown): boolean {
  if (!Array.isArray(values)) return isBlankText(values);
  const seen = new WeakSet<object>();
  seen.add(values);
  const { items, truncated } = flattenNestedArrays(values, seen, 0);
  return !truncated && items.every(isBlankText);
}

/** 配列ではない IIIF の値が空か（版 2 の言語つきの値・版 3 の言語の表） */
function isBlankSingleValue(raw: unknown): boolean {
  if (isBlankText(raw)) return true;
  if (!isPlainObject(raw)) return false;
  if (hasOwn(raw, "@value")) return isBlankText(raw["@value"]);
  const entries = Object.entries(raw);
  // @ で始まる鍵しか無いものは、空ではなく形の読めない値として扱う
  if (entries.length > 0 && entries.every(([key]) => key.startsWith("@"))) return false;
  return entries.every(([key, values]) => key.startsWith("@") || isBlankLanguageValues(values));
}

/**
 * metadata の値が空か（写す中身が無いか）。
 * 中身があって形が読めない値（数・循環する値・深さ上限を超えた入れ子など）とは分ける。
 * 入れ子の配列は深さ上限つきで平らにして中身を見る。循環・深さ上限で読み落とした形が
 * あるときは、空ではなく読めない値として扱う（警告して捨てる側に回す）。
 */
function isBlankMetadataValue(raw: unknown): boolean {
  if (!Array.isArray(raw)) return isBlankSingleValue(raw);
  const seen = new WeakSet<object>();
  seen.add(raw);
  const { items, truncated } = flattenNestedArrays(raw, seen, 0);
  return !truncated && items.every(isBlankSingleValue);
}

/**
 * metadata の一覧を写した行にする（順を保つ）。
 * 値が空の行は写す価値が無いので、警告なしで捨てる。中身があって読めない行は警告して捨てる。
 */
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
    if (isBlankMetadataValue(raw.value)) continue;
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
    // 「その項目が無い」と「あるが形が読めない」を警告の文で分ける
    if (isMissingValue(raw)) {
      unresolved.push(key);
      warnings.push(
        property === "rights"
          ? `鍵 ${key} のライセンスの値がありません`
          : `鍵 ${key} の IIIF の値がありません`
      );
      continue;
    }
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
 * 取り直した値にあって copiedValues に無い鍵・言語（写した後に結び付けた鍵、前回は値が無く写せなかった鍵、
 * 増えた言語）も行にする。その行は IIIF の側が変わったとみなし、人が直したかは今の地図に値があるかで見る。
 * 行の順は、copiedValues の鍵ごとに写した言語 → 増えた言語、その後に copiedValues に無い鍵を取り直した値の順で並べる。
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
  // 多言語でない鍵・文字列で写した値は、lang の言語の値として比べる
  const nowOf = (key: string, language: string): string | undefined => {
    const currentValue = current?.[key];
    return typeof currentValue === "string"
      ? language === lang
        ? currentValue
        : undefined
      : currentValue?.[language];
  };
  const copiedTables = copiedValues ?? {};
  for (const [key, table] of Object.entries(copiedTables)) {
    if (!table) continue;
    for (const [language, copied] of Object.entries(table)) {
      const now = nowOf(key, language);
      const humanEdited = now === undefined || now !== copied;
      const iiifChanged = fresh === undefined ? undefined : fresh[key]?.[language] !== copied;
      rows.push({ key, lang: language, humanEdited, iiifChanged });
    }
    // 前回写した後に取り直した値で増えた言語は、その鍵の行の後ろに足す
    for (const language of Object.keys(fresh?.[key] ?? {})) {
      if (Object.prototype.hasOwnProperty.call(table, language)) continue;
      rows.push({ key, lang: language, humanEdited: nowOf(key, language) !== undefined, iiifChanged: true });
    }
  }
  // 前回写した値に無い鍵（後から結び付けた・前回は値が無く写せなかった）は、最後に取り直した値の順で足す。
  // 写した時点の値は無いので、人が直したかは今の地図に値があるかで見る。
  for (const [key, table] of Object.entries(fresh ?? {})) {
    if (!table || copiedTables[key]) continue;
    for (const language of Object.keys(table)) {
      rows.push({ key, lang: language, humanEdited: nowOf(key, language) !== undefined, iiifChanged: true });
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
