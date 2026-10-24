// 層 A（<maplat-app>）の共通の面の適合テスト群（仕様 §8.2・U7）。@maplat/core/conformance から公開する。
//
// 層 A の**公開面だけ**（属性・プロパティ・メソッド・イベント）を使い、実装の中身には触れない。
// 試験の道具（vitest・Playwright 等）に依らない形で書き、実装のリポジトリは「自分の要素を登録する
// 関数」と固定データを渡して走らせるだけにする:
//
//   // vitest 等（describe / it を渡す）
//   import { runLayerAConformance } from "@maplat/core/conformance";
//   runLayerAConformance({ implementation: "core-pro", register: () => import("../src/element"),
//     fixture: { attributes: { "app-id": "sample" }, initialMapId: "a", otherMapId: "b" } }, { describe, it });
//
//   // 実ブラウザのページの中（結果の配列を返す）
//   const results = await runLayerAConformanceInPage(options);
//
// Pro 固有機能の試験はここに入れない（supports() が偽のときに機能が隠れることだけを共通の面として見る）。
// 依存は element_contract だけ（OpenLayers 等を引き込まない）。
import {
  ELEMENT_ATTRIBUTES,
  ELEMENT_OWN_METHODS,
  ELEMENT_PROPERTIES,
  LAYER_A_FEATURE_NAMES,
  LAYER_A_PRO_ATTRIBUTES,
  LAYER_A_PRO_METHODS,
  LIFECYCLE_PHASES,
  MAPLAT_APP_METHODS,
  MAPLAT_APP_TAG,
  featuresOf,
  isLifecycleDetail,
  isLngLat,
  isMapListItem,
  isMapMeta,
  isMaplatPoi,
  isPoiLayer,
  isSourceLoadedDetail,
  isViewpoint,
  type AttrDef,
  type MaplatAppElement
} from "../element_contract";

/** 実装に流すときの固定データ。 */
export interface LayerAFixture {
  /** 起動の材料の属性（例 { "app-id": "morioka" }）。地図を作るのに足りる組を与える */
  attributes?: Record<string, string>;
  /** 起動の材料のプロパティ（例 { setting: {...} }） */
  properties?: Record<string, unknown>;
  /** 起動したときに出る地図（設定ファイルの startFrom 等） */
  initialMapId: string;
  /** 切替先に使う、使える地図（initialMapId と別のもの） */
  otherMapId: string;
  /** 範囲を持つ地図（getMapEnvelope が値を返すもの。無ければ値の検査を省く） */
  envelopeMapId?: string;
}

export interface LayerAConformanceOptions {
  /** 期待する implementation の値（"core" / "core-pro" / 模擬なら任意） */
  implementation: string;
  /** 要素を登録する関数（何度呼ばれてもよいこと。2 回目の呼び出しも試験の対象） */
  register: () => unknown | Promise<unknown>;
  fixture: LayerAFixture;
  /** タグ名（既定 maplat-app） */
  tagName?: string;
  /** supports() の期待値（既定は機能表 LAYER_A_FEATURES の implementation の列） */
  expectedFeatures?: Record<string, boolean>;
  /** 環境の能力。layout: 実ブラウザの寸法・CSS がある（jsdom では false） */
  capabilities?: { layout?: boolean };
  /** ready・イベントの待ちの上限（ms。既定 30000） */
  timeout?: number;
}

export interface ConformanceCase {
  /** 仕様 §8.2 の群（A-形・A-同期 …） */
  group: string;
  name: string;
  run(): Promise<void>;
}

export interface ConformanceResult {
  group: string;
  name: string;
  ok: boolean;
  error?: string;
  ms: number;
}

/** 適合テストの失敗。 */
export class ConformanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConformanceError";
  }
}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new ConformanceError(message);
}
function same(actual: unknown, expected: unknown, message: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new ConformanceError(`${message}: expected ${e}, got ${a}`);
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
/** 次の描画（requestAnimationFrame。無い環境では 16 ms）。 */
const nextFrame = () =>
  new Promise<void>(r => (typeof requestAnimationFrame === "function" ? requestAnimationFrame(() => r()) : setTimeout(r, 16)));

/** 属性の変化を数える（MutationObserver。値は記録の時点の属性の値）。 */
function watchAttribute(el: Element, attr: string) {
  const values: Array<string | null> = [];
  const observer = new MutationObserver(list => {
    for (const r of list) if (r.attributeName === attr) values.push((r.target as Element).getAttribute(attr));
  });
  observer.observe(el, { attributes: true, attributeFilter: [attr] });
  return {
    values,
    stop() {
      for (const r of observer.takeRecords()) if (r.attributeName === attr) values.push(el.getAttribute(attr));
      observer.disconnect();
    }
  };
}

/** 要素の上の 1 点を押して離す（本物の入力と同じ pointer の列。地図の実装が自分のやり方でクリックを受ける）。 */
function tapAt(clientX: number, clientY: number) {
  const target = document.elementFromPoint(clientX, clientY) ?? document.body;
  const init = {
    bubbles: true,
    cancelable: true,
    composed: true,
    clientX,
    clientY,
    pointerId: 1,
    pointerType: "mouse",
    isPrimary: true,
    button: 0
  };
  target.dispatchEvent(new PointerEvent("pointerdown", { ...init, buttons: 1 }));
  target.dispatchEvent(new PointerEvent("pointerup", { ...init, buttons: 0 }));
}

/** 1×1 の PNG（適合テストの POI レイヤーの icon に使う） */
const CONFORMANCE_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function waitFor<T>(fn: () => T | undefined | null | false, timeout: number, message: string): Promise<T> {
  const start = Date.now();
  for (;;) {
    const v = fn();
    if (v) return v as T;
    if (Date.now() - start > timeout) throw new ConformanceError(`timeout: ${message}`);
    await sleep(20);
  }
}

function withTimeout<T>(p: Promise<T>, timeout: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new ConformanceError(`timeout: ${message}`)), timeout);
    p.then(
      v => {
        clearTimeout(t);
        resolve(v);
      },
      e => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

function nextEvent(target: EventTarget, type: string, timeout: number, filter?: (e: CustomEvent) => boolean) {
  return withTimeout(
    new Promise<CustomEvent>(resolve => {
      const listener = (e: Event) => {
        if (filter && !filter(e as CustomEvent)) return;
        target.removeEventListener(type, listener);
        resolve(e as CustomEvent);
      };
      target.addEventListener(type, listener);
    }),
    timeout,
    `event "${type}"`
  );
}

/** console.warn を一時的に横取りして数える。 */
function captureWarnings() {
  const original = console.warn;
  const messages: string[] = [];
  console.warn = (...args: unknown[]) => {
    messages.push(args.map(a => String(a)).join(" "));
  };
  return {
    messages,
    restore() {
      console.warn = original;
    }
  };
}

/** 画像の URL が読めるか（文書の基点で解決する。<maplat-ui> 等の <img> と同じ）。 */
function loadsAsImage(src: string, timeout: number): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image();
    const t = setTimeout(() => resolve(false), timeout);
    img.onload = () => {
      clearTimeout(t);
      resolve(img.naturalWidth > 0);
    };
    img.onerror = () => {
      clearTimeout(t);
      resolve(false);
    };
    img.src = src;
  });
}

/** 実装が同梱するベースマップ（設定ファイルの sources に文字列で書く地図。Core の baseDict の鍵）。 */
const BUNDLED_BASEMAP_IDS = ["osm", "gsi", "gsi_ortho"];

const isDomException = (e: unknown) =>
  !!e && typeof e === "object" && (e as { name?: string }).name === "InvalidStateError";

type El = MaplatAppElement & Record<string, any>;

interface MountOptions {
  attributes?: Record<string, string>;
  properties?: Record<string, unknown>;
  /** 接続の前に付けておくリスナ（記録する） */
  record?: string[];
  /** 付けない（作る前の要素） */
  connect?: boolean;
  /** 固定データの材料を使わない */
  bare?: boolean;
}

/** 層 A の適合テスト群（試験の道具に依らない形）を作る。 */
export function createLayerAConformanceCases(options: LayerAConformanceOptions): ConformanceCase[] {
  const tag = options.tagName ?? MAPLAT_APP_TAG;
  const fx = options.fixture;
  const timeout = options.timeout ?? 30000;
  const layout = options.capabilities?.layout === true;
  const expectedFeatures = options.expectedFeatures ?? featuresOf(options.implementation);
  let registered: Promise<void> | null = null;
  const ensureRegistered = () => {
    if (!registered) registered = Promise.resolve(options.register()).then(() => undefined);
    return registered.then(() => customElements.whenDefined(tag)).then(() => undefined);
  };

  /** 1 件の試験の中で作った要素と入れ物（終わったら外す）。 */
  const withContext = (fn: (ctx: Ctx) => Promise<void>) => async () => {
    await ensureRegistered();
    const ctx = new Ctx(tag, fx, timeout);
    try {
      await fn(ctx);
    } finally {
      ctx.cleanup();
    }
  };

  const cases: ConformanceCase[] = [];
  const add = (group: string, name: string, fn: (ctx: Ctx) => Promise<void>) =>
    cases.push({ group, name, run: withContext(fn) });

  // ---- A-形 ----
  add("A-形", "タグが登録され、要素は HTMLElement で implementation・version を持つ", async () => {
    assert(customElements.get(tag), `<${tag}> is not defined`);
    const el = document.createElement(tag) as El;
    assert(el instanceof HTMLElement, "element is not an HTMLElement");
    same(el.implementation, options.implementation, "implementation");
    assert(typeof el.version === "string" && /^\d+\.\d+\.\d+/.test(el.version), `version is not semver: ${el.version}`);
  });

  add("A-形", "登録をもう一度呼んでも上書きせず、例外にしない", async () => {
    const before = customElements.get(tag);
    await options.register();
    assert(customElements.get(tag) === before, "the definition was replaced");
  });

  add("A-形", "light DOM（shadowRoot が null）で、操作ボタン（押せる要素）を持たない", async ctx => {
    const el = await ctx.mountReady();
    assert(el.shadowRoot === null, "shadowRoot is not null (layer A must use light DOM)");
    const clickable = el.querySelectorAll('button, input, select, textarea, [role="button"], .ol-control');
    same(clickable.length, 0, "clickable controls inside the element");
  });

  if (layout) {
    add("A-形", "既定の箱は display:block・高さ 400px で、ページの CSS が常に勝つ", async ctx => {
      const el = ctx.mount({ bare: true });
      await sleep(0);
      const cs = getComputedStyle(el);
      same(cs.display, "block", "default display");
      same(Math.round(el.getBoundingClientRect().height), 400, "default height");
      const style = document.createElement("style");
      style.textContent = ".maplat-conformance-css { height: 123px; }";
      document.head.appendChild(style);
      ctx.onCleanup(() => style.remove());
      el.classList.add("maplat-conformance-css");
      same(Math.round(el.getBoundingClientRect().height), 123, "height from the page CSS");
    });
  }

  // ---- A-同期（地図を作らない要素で） ----
  const boolDefs = ELEMENT_ATTRIBUTES.filter(d => d.kind === "boolean");
  const numDefs = ELEMENT_ATTRIBUTES.filter(d => d.kind === "number");
  const strDefs = ELEMENT_ATTRIBUTES.filter(d => d.kind === "string");

  add("A-同期", "真偽の属性: \"\"・\"true\"・属性名＝true、\"false\"＝false、不正値は警告して未指定", async ctx => {
    const el = ctx.mount({ bare: true, connect: false });
    const warn = captureWarnings();
    try {
      for (const def of boolDefs) {
        const read = () => el[def.prop];
        same(read(), undefined, `${def.attr}: no attribute`);
        for (const [raw, expected] of [["", true], ["true", true], [def.attr, true], ["false", false]] as const) {
          el.setAttribute(def.attr, raw);
          same(read(), expected, `${def.attr}="${raw}"`);
        }
        const before = warn.messages.length;
        el.setAttribute(def.attr, "bogus");
        same(read(), undefined, `${def.attr}="bogus"`);
        assert(warn.messages.length > before, `${def.attr}="bogus" did not warn`);
        el.removeAttribute(def.attr);
        same(read(), undefined, `${def.attr} removed`);
      }
    } finally {
      warn.restore();
    }
  });

  add("A-同期", "数の属性: \"\" は未指定、数でない値は警告して未指定", async ctx => {
    const el = ctx.mount({ bare: true, connect: false });
    const warn = captureWarnings();
    try {
      for (const def of numDefs) {
        el.setAttribute(def.attr, "12");
        same(el[def.prop], 12, `${def.attr}="12"`);
        el.setAttribute(def.attr, "0");
        same(el[def.prop], 0, `${def.attr}="0"`);
        el.setAttribute(def.attr, "");
        same(el[def.prop], undefined, `${def.attr}=""`);
        const before = warn.messages.length;
        el.setAttribute(def.attr, "abc");
        same(el[def.prop], undefined, `${def.attr}="abc"`);
        assert(warn.messages.length > before, `${def.attr}="abc" did not warn`);
        el.removeAttribute(def.attr);
      }
    } finally {
      warn.restore();
    }
  });

  add("A-同期", "文字列の属性: \"\" は未指定・そのままの値", async ctx => {
    const el = ctx.mount({ bare: true, connect: false });
    for (const def of strDefs) {
      el.setAttribute(def.attr, "");
      same(el[def.prop], undefined, `${def.attr}=""`);
      el.setAttribute(def.attr, "conformance-value");
      same(el[def.prop], "conformance-value", `${def.attr}="conformance-value"`);
      el.removeAttribute(def.attr);
    }
  });

  add("A-同期", "プロパティ → 属性の書き戻し（true→\"\"・false→\"false\"・数・文字列、null・undefined→外す）", async ctx => {
    const el = ctx.mount({ bare: true, connect: false });
    const check = (def: AttrDef, value: unknown, attr: string | null) => {
      el[def.prop] = value;
      same(el.getAttribute(def.attr), attr, `${def.prop} = ${JSON.stringify(value)} → attribute`);
    };
    for (const def of boolDefs) {
      check(def, true, "");
      check(def, false, "false");
      check(def, null, null);
      check(def, false, "false");
      check(def, undefined, null);
    }
    for (const def of numDefs) {
      check(def, 5, "5");
      check(def, 0, "0");
      check(def, null, null);
    }
    for (const def of strDefs) {
      check(def, "x", "x");
      check(def, undefined, null);
    }
  });

  add("A-同期", "プロパティのみのキーは属性へ書き戻さず、null で未指定に戻る", async ctx => {
    const el = ctx.mount({ bare: true, connect: false });
    const attrsBefore = el.getAttributeNames().length;
    for (const def of ELEMENT_PROPERTIES) {
      const value = def.prop === "restoreExtensionKeys" ? ["k"] : def.prop === "maplibregl" || def.prop === "mapboxgl" ? {} : def.prop.endsWith("Template") || def.prop === "poiStyle" || def.prop.endsWith("Key") || def.prop.endsWith("Token") ? "v" : {};
      el[def.prop] = value;
      assert(el[def.prop] === value, `${def.prop}: read back`);
      el[def.prop] = null;
      same(el[def.prop], undefined, `${def.prop} = null`);
    }
    same(el.getAttributeNames().length, attrsBefore, "attributes written by property-only keys");
  });

  // ---- A-優先 ----
  add("A-優先", "起動時の map-id・transparency が restore より強い", async ctx => {
    const el = await ctx.mountReady({
      attributes: { "map-id": fx.otherMapId, transparency: "30" },
      properties: { restore: { mapID: fx.initialMapId, transparency: 70 } }
    });
    same(el.currentMapId, fx.otherMapId, "currentMapId");
    same(el.getTransparency(), 30, "getTransparency()");
    same(el.initialRestore.mapID, fx.otherMapId, "initialRestore.mapID");
  });

  add("A-優先", "false・0 が与えた値として残る（north-up=\"false\"・home-margin-pixels=\"0\"）", async ctx => {
    const el = await ctx.mountReady({ attributes: { "north-up": "false", "home-margin-pixels": "0" } });
    same(el.northUp, false, "northUp");
    same(el.homeMarginPixels, 0, "homeMarginPixels");
  });

  // ---- A-起動後 ----
  add("A-起動後", "起動時キーの属性の起動後の変更は警告して無視し、作り直さない", async ctx => {
    const el = await ctx.mountReady();
    const ready = el.ready;
    const before = el.appId;
    const seen: Event[] = [];
    el.addEventListener("lifecycle:setting-loaded", e => seen.push(e));
    const warn = captureWarnings();
    try {
      el.setAttribute("app-id", "conformance-other-app");
      el.setAttribute("app-id", "conformance-other-app-2");
      await sleep(300);
      same(warn.messages.length, 1, "warnings for app-id");
    } finally {
      warn.restore();
    }
    same(el.appId, before, "appId after the change");
    assert(el.ready === ready, "ready was replaced");
    same(seen.length, 0, "the map was recreated (lifecycle:setting-loaded)");
    assert(el.currentMapId !== null, "currentMapId is null after the ignored change");
  });

  add("A-起動後", "起動時キーのプロパティの起動後の代入は警告して無視し、起動時の値を返す", async ctx => {
    const el = await ctx.mountReady();
    const before = el.restore;
    const warn = captureWarnings();
    try {
      el.restore = { mapID: "conformance-no-such-map" };
      el.restore = { mapID: "conformance-no-such-map-2" };
      same(warn.messages.length, 1, "warnings for restore");
    } finally {
      warn.restore();
    }
    same(el.restore, before, "restore after the assignment");
  });

  add("A-起動後", "起動した地図が map-id へ書き戻され、map-id の変更で地図が切り替わる", async ctx => {
    const el = await ctx.mountReady();
    // §3.3・§6.2.3: 属性を与えていなくても、表示中の地図が map-id に載る（el.mapId は表示中の地図）
    await waitFor(() => el.getAttribute("map-id") === fx.initialMapId, timeout, `map-id="${fx.initialMapId}" after startup`);
    same(el.mapId, fx.initialMapId, "mapId after startup");
    const changed = nextEvent(el, "mapChanged", timeout, e => e.detail?.mapID === fx.otherMapId);
    el.setAttribute("map-id", fx.otherMapId);
    await changed;
    same(el.currentMapId, fx.otherMapId, "currentMapId after map-id");
    same(el.mapId, fx.otherMapId, "mapId after map-id");
  });

  add("A-起動後", "内部の操作（changeMap）で map-id が書き戻され、書き戻しで二重に切り替えない", async ctx => {
    const el = await ctx.mountReady({ attributes: { "map-id": fx.initialMapId } });
    await sleep(200); // 起動時の書き戻しを済ませる
    const seen: string[] = [];
    let attrAtEvent: string | null | undefined;
    el.addEventListener("mapChanged", e => {
      seen.push((e as CustomEvent).detail?.mapID);
      if (attrAtEvent === undefined) attrAtEvent = el.getAttribute("map-id");
    });
    const mutations = watchAttribute(el, "map-id");
    await el.changeMap(fx.otherMapId);
    await waitFor(() => el.currentMapId === fx.otherMapId, timeout, "map switched by changeMap()");
    await sleep(400); // 書き戻しが属性の変更として扱われたら、ここで二度目の切り替え（mapChanged）が起きる
    mutations.stop();
    same(el.getAttribute("map-id"), fx.otherMapId, "map-id attribute after changeMap()");
    same(el.mapId, fx.otherMapId, "mapId after changeMap()");
    same(el.currentMapId, el.mapId, "currentMapId equals mapId");
    same(attrAtEvent, fx.otherMapId, "map-id seen by the mapChanged listener (written back before the event)");
    same(seen, [fx.otherMapId], "mapChanged events after changeMap()");
    same(mutations.values, [fx.otherMapId], "map-id attribute mutations");
  });

  add("A-起動後", "書き戻しの後に元の値を setAttribute すると、その地図へ戻せる", async ctx => {
    const el = await ctx.mountReady({ attributes: { "map-id": fx.initialMapId } });
    await el.changeMap(fx.otherMapId);
    await waitFor(() => el.getAttribute("map-id") === fx.otherMapId, timeout, "map-id written back");
    const back = nextEvent(el, "mapChanged", timeout, e => e.detail?.mapID === fx.initialMapId);
    el.setAttribute("map-id", fx.initialMapId);
    await back;
    same(el.currentMapId, fx.initialMapId, "currentMapId after setAttribute(map-id, the first map)");
    same(el.getAttribute("map-id"), fx.initialMapId, "map-id attribute");
  });

  add("A-起動後", "transparency の変更が state・updateState に載り、setTransparency() の変更も属性へ書き戻される", async ctx => {
    const el = await ctx.mountReady();
    const updated = nextEvent(el, "updateState", timeout, e => e.detail?.transparency === 35);
    el.transparency = 35;
    await updated;
    same(el.state.transparency, 35, "state.transparency");
    same(el.getTransparency(), 35, "getTransparency()");
    el.setTransparency(10);
    await waitFor(() => el.getAttribute("transparency") === "10", timeout, 'transparency="10" after setTransparency(10)');
    same(el.transparency, 10, "transparency property after setTransparency()");
    await sleep(200);
    same(el.getTransparency(), 10, "getTransparency() after the write-back (not re-applied from the attribute)");
  });

  add("A-起動後", "setTransparency() を続けて呼んでも、属性の書き戻しは描画 1 回につき 1 回で最後の値が残る", async ctx => {
    const el = await ctx.mountReady();
    // 起動時の透過度（0）の書き戻しを済ませてから数える
    await waitFor(() => el.getAttribute("transparency") === "0", timeout, 'transparency="0" after startup');
    await sleep(200);
    const mutations = watchAttribute(el, "transparency");
    for (let i = 1; i <= 20; i++) el.setTransparency(i * 3);
    same(el.getAttribute("transparency"), "0", "transparency attribute right after the calls (written on the next frame)");
    await nextFrame();
    await nextFrame();
    await sleep(300); // updateState（間引きの後）からの書き戻しも同じ値なら書かない
    await nextFrame();
    mutations.stop();
    same(mutations.values, ["60"], "transparency attribute mutations for 20 calls in one frame");
    same(el.transparency, 60, "transparency property");
    same(el.getTransparency(), 60, "getTransparency()");
  });

  add("A-起動後", "地図を切り替えても透過度を保つ（§3.8 A4）", async ctx => {
    const el = await ctx.mountReady();
    el.setTransparency(40);
    await el.changeMap(fx.otherMapId);
    await waitFor(() => el.currentMapId === fx.otherMapId, timeout, "map switched");
    same(el.getTransparency(), 40, "getTransparency() after changeMap");
    await waitFor(() => el.state.transparency === 40, timeout, "state.transparency stays 40");
  });

  // ---- A-メソッド ----
  add("A-メソッド", "46 の委譲メソッドと新設メソッドが関数として在る", async () => {
    const el = document.createElement(tag) as El;
    for (const name of [...MAPLAT_APP_METHODS, ...ELEMENT_OWN_METHODS]) {
      same(typeof el[name], "function", `typeof ${name}`);
    }
  });

  add("A-メソッド", "地図を作る前の委譲メソッドは例外を投げ、新設の読み取りは空を返す", async ctx => {
    const el = ctx.mount({ bare: true, connect: false });
    for (const name of ["getTransparency", "changeMap", "goHome", "getMapMeta"] as const) {
      let thrown: unknown;
      try {
        (el[name] as (...a: unknown[]) => unknown)(fx.initialMapId);
      } catch (e) {
        thrown = e;
      }
      assert(isDomException(thrown), `${name}() before creation did not throw InvalidStateError`);
    }
    same(el.listMaps(), [], "listMaps() before creation");
    same(el.getViewpoint(), null, "getViewpoint() before creation");
    same(el.getMapEnvelope(fx.initialMapId), null, "getMapEnvelope() before creation");
    same(el.getViewExtent(), null, "getViewExtent() before creation");
    same(el.currentMapId, null, "currentMapId before creation");
    same(el.appData, null, "appData before creation");
    same(el.gpsEnabled, false, "gpsEnabled before creation");
  });

  add("A-メソッド", "listMaps・currentMapInfo・getMapMeta・appData の形", async ctx => {
    const el = await ctx.mountReady();
    const maps = el.listMaps();
    assert(Array.isArray(maps) && maps.length >= 2, "listMaps() has fewer than 2 maps");
    for (const m of maps) assert(isMapListItem(m), `listMaps() item has a wrong shape: ${JSON.stringify(m)}`);
    const ids = maps.map(m => m.mapID);
    assert(ids.includes(fx.initialMapId) && ids.includes(fx.otherMapId), `listMaps() lacks the fixture maps: ${ids}`);
    same(new Set(ids).size, ids.length, "duplicated mapID in listMaps()");
    assert(isMapMeta(el.getMapMeta(fx.otherMapId)), "getMapMeta(mapID) shape");
    same(el.getMapMeta(fx.otherMapId)!.mapID, fx.otherMapId, "getMapMeta(mapID).mapID");
    same(el.currentMapInfo()?.mapID, fx.initialMapId, "currentMapInfo().mapID");
    const data = el.appData;
    assert(data && Object.isFrozen(data), "appData is not a frozen object");
    assert(Object.isFrozen(el.state) && Object.isFrozen(el.initialRestore), "state / initialRestore are not frozen");
  });

  add("A-メソッド", "listPoiLayers の要素は PoiLayer の形（main が先頭・addPoiLayer の icon を保つ・POI に namespaceID）", async ctx => {
    const el = await ctx.mountReady();
    const vp = await waitFor(() => el.getViewpoint(), timeout, "a viewpoint");
    const layerId = "conformance-layer";
    el.addPoiLayer(layerId, { name: "conformance", icon: CONFORMANCE_ICON, pois: [] });
    el.addMarker({ lnglat: [vp.longitude, vp.latitude], name: "conformance-poi" }, layerId);
    const layers = el.listPoiLayers();
    assert(Array.isArray(layers) && layers.length >= 2, `listPoiLayers() has fewer than 2 layers: ${JSON.stringify(layers?.length)}`);
    for (const layer of layers) {
      assert(isPoiLayer(layer), `listPoiLayers() item has a wrong shape: ${JSON.stringify({ ...layer, pois: layer?.pois?.length })}`);
    }
    same(layers[0].namespaceID, "main", "the first layer of listPoiLayers()");
    const mine = layers.find(l => l.namespaceID === layerId);
    assert(mine, `listPoiLayers() lacks ${layerId}`);
    same(mine.icon, CONFORMANCE_ICON, "icon of the layer given to addPoiLayer()");
    same(mine.name, "conformance", "name of the layer given to addPoiLayer()");
    same(mine.pois.length, 1, "POIs of the layer after addMarker()");
    assert(isMaplatPoi(mine.pois[0]) && mine.pois[0].namespaceID !== "", "the POI added by addMarker() has no namespaceID");
    same(el.getPoiLayer(layerId)?.icon, CONFORMANCE_ICON, "getPoiLayer().icon");
    assert(
      el.listPoiLayers(false, true).every(l => l.pois.length > 0) &&
        el.listPoiLayers(false, true).some(l => l.namespaceID === layerId),
      "listPoiLayers(false, true) must list only the layers with POIs"
    );
    el.hidePoiLayer(layerId);
    const hidden = el.listPoiLayers(true);
    assert(hidden.every(l => l.hide === true) && hidden.some(l => l.namespaceID === layerId), "listPoiLayers(true) must list the hidden layers");
    el.showPoiLayer(layerId);
    el.removePoiLayer(layerId);
    assert(!el.listPoiLayers().some(l => l.namespaceID === layerId), "removePoiLayer() did not remove the layer");
  });

  add("A-メソッド", "getDefaultPinIcon は既定のピンの画像の URL（選択中の画像も。地図を作る前でも答える）", async () => {
    const el = document.createElement(tag) as El;
    const pin = el.getDefaultPinIcon();
    const selected = el.getDefaultPinIcon(true);
    assert(typeof pin === "string" && pin !== "", `getDefaultPinIcon(): ${JSON.stringify(pin)}`);
    assert(typeof selected === "string" && selected !== "", `getDefaultPinIcon(true): ${JSON.stringify(selected)}`);
    same(el.getDefaultPinIcon(false), pin, "getDefaultPinIcon(false)");
    if (layout) {
      assert(await loadsAsImage(pin, timeout), `getDefaultPinIcon() does not load: ${pin.slice(0, 80)}`);
      assert(await loadsAsImage(selected, timeout), `getDefaultPinIcon(true) does not load: ${selected.slice(0, 80)}`);
    }
  });

  // ---- A-互換（実装間で値の形が揃っていること）----
  add("A-互換", "同梱ベースマップ（osm・gsi・gsi_ortho）の listMaps の thumbnail は実装が用意した画像の URL", async ctx => {
    const el = await ctx.mountReady();
    const bundled = el.listMaps().filter(m => BUNDLED_BASEMAP_IDS.includes(m.mapID));
    for (const m of bundled) {
      // 同梱ベースマップの画像は実装の持ち物（ページの tmbs/ 等の置き場に依らない）。null・空にしない
      assert(
        typeof m.thumbnail === "string" && m.thumbnail !== "",
        `listMaps() ${m.mapID}: thumbnail is ${JSON.stringify(m.thumbnail)}`
      );
      assert(
        !/(^|\/)tmbs\//.test(m.thumbnail),
        `listMaps() ${m.mapID}: thumbnail points to the page's tmbs/ (${m.thumbnail}); a bundled base map must use the implementation's image`
      );
      if (layout) {
        assert(await loadsAsImage(m.thumbnail, timeout), `listMaps() ${m.mapID}: thumbnail does not load: ${m.thumbnail.slice(0, 80)}`);
      }
    }
  });

  add("A-メソッド", "getViewpoint・viewpoint の形（changeViewpoint の後）", async ctx => {
    const el = await ctx.mountReady();
    const vp = await waitFor(() => el.getViewpoint(), timeout, "a viewpoint");
    assert(isViewpoint(vp), `getViewpoint() shape: ${JSON.stringify(vp)}`);
    same(el.viewpoint, vp, "viewpoint property equals getViewpoint()");
    assert(el.viewpoint !== el.viewpoint, "viewpoint must return a copy");
  });

  add("A-メソッド", "getRotation は数、getDirection は Promise で数が返る", async ctx => {
    const el = await ctx.mountReady();
    assert(typeof el.getRotation() === "number", "getRotation() must return a number");
    const pending = el.getDirection();
    assert(typeof pending?.then === "function", "getDirection() must return a Promise (thenable)");
    const direction = await pending;
    assert(typeof direction === "number" && Number.isFinite(direction), `getDirection() must resolve to a number: ${direction}`);
  });

  add("A-メソッド", "clientPointToLngLat・lngLatToClientPoint は Promise でオブジェクトか null（§3.8 A1）", async ctx => {
    const el = await ctx.mountReady();
    await waitFor(() => el.getViewpoint(), timeout, "a viewpoint");
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const p = el.clientPointToLngLat(cx, cy);
    assert(typeof p?.then === "function", "clientPointToLngLat() does not return a Promise (thenable)");
    const ll = await p;
    assert(ll === null || isLngLat(ll), `clientPointToLngLat() result: ${JSON.stringify(ll)}`);
    if (layout) {
      assert(ll !== null, "clientPointToLngLat(center) is null");
      const back = await el.lngLatToClientPoint(ll.longitude, ll.latitude);
      assert(back !== null && Math.abs(back.x - cx) < 2 && Math.abs(back.y - cy) < 2, `round trip: ${JSON.stringify(back)}`);
    } else {
      const back = await el.lngLatToClientPoint(0, 0);
      assert(back === null || (typeof back.x === "number" && typeof back.y === "number"), "lngLatToClientPoint() result");
    }
  });

  add("A-メソッド", "getMapEnvelope は範囲の多角形か null、getViewExtent は 4 隅か null", async ctx => {
    const el = await ctx.mountReady();
    same(el.getMapEnvelope("conformance-no-such-map"), null, "getMapEnvelope(unknown)");
    for (const m of el.listMaps()) {
      const env = el.getMapEnvelope(m.mapID);
      same(env !== null, m.hasEnvelope, `getMapEnvelope(${m.mapID}) vs hasEnvelope`);
    }
    if (fx.envelopeMapId) {
      const env = el.getMapEnvelope(fx.envelopeMapId);
      assert(Array.isArray(env) && env.length >= 3 && env.every(isLngLat), `getMapEnvelope(${fx.envelopeMapId})`);
    }
    if (layout) {
      const extent = await waitFor(() => el.getViewExtent(), timeout, "getViewExtent()");
      assert(extent.length === 4 && extent.every(isLngLat), `getViewExtent() shape: ${JSON.stringify(extent)}`);
      // 古地図は画面の上が北とは限らない（地図ごとの向き）ので、向きは問わず 4 隅が別の点であることだけを見る
      const keys = new Set(extent.map(p => `${p.longitude.toFixed(9)},${p.latitude.toFixed(9)}`));
      same(keys.size, 4, "getViewExtent(): distinct corners");
    } else {
      const extent = el.getViewExtent();
      assert(extent === null || (extent.length === 4 && extent.every(isLngLat)), "getViewExtent() shape");
    }
  });

  add("A-メソッド", "setEnvelopes は指定・空配列・未知の地図で例外を投げない", async ctx => {
    const el = await ctx.mountReady();
    const target = fx.envelopeMapId ?? fx.otherMapId;
    el.setEnvelopes([
      { mapID: target, stroke: { color: "#ff0000", width: 2, lineDash: [6, 6] } },
      { mapID: target, fill: "rgba(0, 0, 255, 0.4)" },
      { mapID: "conformance-no-such-map", stroke: { color: "#000" } }
    ]);
    await sleep(100);
    await el.changeMap(fx.otherMapId);
    await sleep(100);
    el.setEnvelopes([]);
    await sleep(50);
  });

  add("A-メソッド", "タイルキャッシュの統計は Promise でオブジェクト（数は number）", async ctx => {
    const el = await ctx.mountReady();
    const stats = await el.getMapTileCacheStatsAsync();
    assert(stats && typeof stats === "object", "getMapTileCacheStatsAsync() result");
    for (const k of ["size", "count", "total"] as const) {
      const v = (stats as Record<string, unknown>)[k];
      assert(v === undefined || typeof v === "number", `stats.${k} is not a number: ${v}`);
    }
    same(typeof (await el.getMapTileCacheSizeAsync()), "number", "getMapTileCacheSizeAsync()");
    same(typeof el.getMapCacheEnable(fx.initialMapId), "boolean", "getMapCacheEnable()");
  });

  // §3.8 A10: 統計には全タイル数 total を含める。キャッシュを持つ地図があるときだけ見る
  // （Core は enable-cache 無しで起動すると Weiwudi を持たず、getMapCacheEnable も統計も空になる。
  //  固定データの地図がキャッシュを持たない実装では、この検査は省く）
  add("A-メソッド", "キャッシュを持つ地図の統計には全タイル数 total が数で載る（§3.8 A10）", async ctx => {
    const el = await ctx.mountReady();
    if (!el.supports("tile-cache")) return;
    const cached = el.listMaps().find(m => m.cacheEnable);
    if (!cached) return;
    const stats = await el.getMapTileCacheStatsAsync(cached.mapID);
    assert(stats && typeof stats === "object", `getMapTileCacheStatsAsync(${cached.mapID}) result`);
    assert(
      typeof stats.total === "number" && Number.isFinite(stats.total) && Number.isInteger(stats.total) && stats.total >= 0,
      `getMapTileCacheStatsAsync(${cached.mapID}).total is not a tile count: ${JSON.stringify(stats)}`
    );
    same(typeof stats.size, "number", "stats.size of a cached map");
    same(typeof stats.count, "number", "stats.count of a cached map");
    // キャッシュを持たない地図は本物と同じく空（total を 0 で埋めない）
    const plain = el.listMaps().find(m => !m.cacheEnable);
    if (plain) {
      const empty = await el.getMapTileCacheStatsAsync(plain.mapID);
      assert(
        empty && typeof empty === "object" && (empty as Record<string, unknown>).total === undefined,
        `getMapTileCacheStatsAsync(${plain.mapID}) of a map without cache: ${JSON.stringify(empty)}`
      );
    }
  });

  add("A-メソッド", "requestUpdateState の拡張キーが state と updateState に載る", async ctx => {
    const el = await ctx.mountReady();
    const updated = nextEvent(el, "updateState", timeout, e => e.detail?.conformanceExt === 1);
    el.requestUpdateState({ conformanceExt: 1 });
    await updated;
    same(el.state.conformanceExt, 1, "state.conformanceExt");
  });

  add("A-メソッド", "zoomBy で視点の zoom が変わる", async ctx => {
    const el = await ctx.mountReady();
    const vp = await waitFor(() => el.getViewpoint(), timeout, "a viewpoint");
    el.zoomBy(1);
    await waitFor(() => (el.getViewpoint()?.zoom ?? -Infinity) > vp.zoom + 0.5, timeout, "zoom increased");
  });

  // ---- A-ベクター（nov26-m4-t5・#91: 線・面の id・個別削除・種類ごとの削除）----
  //
  // 要素の公開面には、Core の中身が持つ一覧（vectors getter）に当たる読み取りが無い。そこで一覧の中身は
  // 「消せるか」で確かめる: add が返した id を removeVector に渡す true／false と、clearLine・clearVector の
  // { type } の絞り込み。並び（追加順・置き換えたものは末尾）と stroke → style の正規化は、公開面から
  // 読めないのでここでは確かめない（正規化は Core の単体試験 spec/nov26-m4-t5-vector-remove.spec.ts が見る）。
  // 描画の画素も見ない（それは各実装の e2e の役目）。座標は固定データの地図の範囲に置く。
  const vectorLine = () => ({ lnglats: [[141.15, 39.7], [141.16, 39.71]] });
  const vectorPolygon = (extra: Record<string, unknown> = {}) => ({
    type: "Polygon",
    lnglats: [[141.14, 39.69], [141.16, 39.69], [141.16, 39.71], [141.14, 39.69]],
    ...extra
  });

  add("A-ベクター", "addLine・addVector は id（文字列）を返し、与えた id はそのまま・自動の id は重ならない", async ctx => {
    const el = await ctx.mountReady();
    const lineId = el.addLine(vectorLine());
    const polygonId = el.addVector(vectorPolygon());
    assert(typeof lineId === "string" && lineId !== "", `addLine() returned ${JSON.stringify(lineId)}`);
    assert(typeof polygonId === "string" && polygonId !== "", `addVector() returned ${JSON.stringify(polygonId)}`);
    assert(lineId !== polygonId, `two automatic ids collide: ${lineId}`);
    same(el.addVector(vectorPolygon({ id: "conformance-vector" })), "conformance-vector", "addVector({ id })");
    same(el.addLine({ ...vectorLine(), id: 42 }), "42", "addLine({ id: 42 }) (the id is a string)");
    el.clearVector();
  });

  add("A-ベクター", "addLine・addVector は呼び手の data を変えない（凍結した data でも例外にしない）", async ctx => {
    const el = await ctx.mountReady();
    const line = Object.freeze({ lnglats: [[141.15, 39.7], [141.16, 39.71]], stroke: { color: "#ff0000", width: 2 } });
    const polygon = Object.freeze(vectorPolygon({ id: "conformance-frozen" }));
    const before = [JSON.stringify(line), JSON.stringify(polygon)];
    el.addLine(line);
    el.addVector(polygon);
    same([JSON.stringify(line), JSON.stringify(polygon)], before, "the caller's data after addLine() / addVector()");
    el.clearVector();
  });

  add("A-ベクター", "既にある id で足すと置き換わり、1 件のまま新しい種類で数える", async ctx => {
    const el = await ctx.mountReady();
    const id = el.addLine({ ...vectorLine(), id: "conformance-replace" });
    same(id, "conformance-replace", "the id of the first addLine()");
    same(el.addVector(vectorPolygon({ id })), id, "the id of the replacing addVector()");
    // 置き換えで前の線が残っていれば、面だけを消した後も同じ id がまだ消せる（残っていないことを見る）
    el.clearVector({ type: "Polygon" });
    same(el.removeVector(id), false, "the Line replaced by the Polygon is gone (an entry was left behind)");
  });

  add("A-ベクター", "type を省いた addVector は線として数え、{ type } の clear がその種類だけを消す", async ctx => {
    const el = await ctx.mountReady();
    const implicitLine = el.addVector(vectorLine()); // type を省く
    el.clearVector({ type: "Line" });
    same(el.removeVector(implicitLine), false, "addVector() without type is counted as Line");
    const polygon = el.addVector(vectorPolygon());
    const line = el.addLine(vectorLine());
    el.clearLine({ type: "Line" });
    same(el.removeVector(line), false, "addLine() is cleared by clearLine({ type: 'Line' })");
    same(el.removeVector(polygon), true, "a Polygon is not cleared by clearLine({ type: 'Line' })");
    el.clearVector();
  });

  add("A-ベクター", "removeVector・removeLine はその 1 件だけを消し、消したら true・無ければ false", async ctx => {
    const el = await ctx.mountReady();
    const line = el.addLine(vectorLine());
    const polygon = el.addVector(vectorPolygon());
    same(el.removeVector(line), true, "removeVector(a line)");
    same(el.removeVector(line), false, "removeVector(the same id again)");
    same(el.removeVector("conformance-no-such-vector"), false, "removeVector(unknown)");
    // removeLine は種類で絞らない別名（残っている面も消せる）
    same(el.removeLine(polygon), true, "removeLine(a polygon)");
    same(el.removeLine(polygon), false, "removeLine(the same id again)");
    // 消した id で足し直せる（消えていることの裏取り）
    same(el.addVector(vectorPolygon({ id: line })), line, "addVector() with the removed id");
    same(el.removeLine(line), true, "removeLine(the re-added entry)");
  });

  add("A-ベクター", "clearLine・clearVector は引数なしで全部、filter.type でその種類だけを消す（どちらも別名）", async ctx => {
    const el = await ctx.mountReady();
    const line1 = el.addLine(vectorLine());
    const line2 = el.addLine(vectorLine());
    const polygon1 = el.addVector(vectorPolygon());
    const polygon2 = el.addVector(vectorPolygon());
    el.clearVector({ type: "Line" });
    same(el.removeVector(line1), false, "clearVector({ type: 'Line' }) removed the first line");
    same(el.removeVector(line2), false, "clearVector({ type: 'Line' }) removed the second line");
    same(el.removeVector(polygon1), true, "clearVector({ type: 'Line' }) kept the first polygon");
    same(el.removeVector(polygon2), true, "clearVector({ type: 'Line' }) kept the second polygon");
    // 引数なしは線も面も全部消す（clearLine も同じ）
    const line3 = el.addLine(vectorLine());
    const polygon3 = el.addVector(vectorPolygon());
    el.clearVector();
    same(el.removeVector(line3), false, "clearVector() removed the line");
    same(el.removeVector(polygon3), false, "clearVector() removed the polygon");
    const line4 = el.addLine(vectorLine());
    const polygon4 = el.addVector(vectorPolygon());
    el.clearLine();
    same(el.removeVector(line4), false, "clearLine() removed the line");
    same(el.removeVector(polygon4), false, "clearLine() removed the polygon");
    // 対象が無いときの clearLine(filter) も例外にしない
    el.clearLine({ type: "Polygon" });
  });

  // ---- A-イベント ----
  add("A-イベント", "lifecycle の 7 段階が旧と同順で出て、detail は phaseId と appData だけ", async ctx => {
    const record = LIFECYCLE_PHASES.map(p => `lifecycle:${p}`);
    const el = await ctx.mountReady({ record });
    const seen = ctx.recorded(el).filter(e => e.type.startsWith("lifecycle:") && e.type !== "lifecycle:error");
    same(
      seen.map(e => e.type),
      record,
      "lifecycle order"
    );
    for (const e of seen) {
      assert(isLifecycleDetail(e.detail), `${e.type} detail keys: ${Object.keys(e.detail || {})}`);
    }
  });

  add("A-イベント", "sourceLoaded の detail は {mapID, usable}[]（§3.8 A2）", async ctx => {
    const el = await ctx.mountReady({ record: ["sourceLoaded"] });
    const seen = ctx.recorded(el).filter(e => e.type === "sourceLoaded");
    assert(seen.length >= 1, "sourceLoaded was not dispatched");
    const detail = seen[0].detail;
    assert(isSourceLoadedDetail(detail), `sourceLoaded detail: ${JSON.stringify(detail)}`);
    assert(
      detail.some(d => d.mapID === fx.initialMapId && d.usable),
      `sourceLoaded lacks ${fx.initialMapId} as usable`
    );
  });

  add("A-イベント", "イベントは CustomEvent で bubbles・composed なし・cancelable なし（mapChanged）", async ctx => {
    const el = await ctx.mountReady();
    const parent = el.parentElement!;
    const got = nextEvent(parent, "mapChanged", timeout, e => e.detail?.mapID === fx.otherMapId);
    await el.changeMap(fx.otherMapId);
    const e = await got;
    assert(e instanceof CustomEvent, "not a CustomEvent");
    assert(e.target === el, "target is not the element");
    same([e.bubbles, e.composed, e.cancelable], [true, false, false], "bubbles / composed / cancelable");
    assert(isMapMeta(e.detail), "mapChanged detail shape");
  });

  add("A-イベント", "視点の変化で changeViewpoint・moveStart・moveEnd が出る", async ctx => {
    const el = await ctx.mountReady();
    await waitFor(() => el.getViewpoint(), timeout, "a viewpoint");
    await sleep(400); // 起動時の動きを落ち着かせる
    const vpEvent = nextEvent(el, "changeViewpoint", timeout);
    const start = nextEvent(el, "moveStart", timeout);
    const end = nextEvent(el, "moveEnd", timeout);
    el.zoomBy(-1);
    assert(isViewpoint((await vpEvent).detail), "changeViewpoint detail shape");
    await start;
    const e = await end;
    assert(e.detail === null || isViewpoint(e.detail), "moveEnd detail shape");
  });

  if (layout) {
    add("A-イベント", "マーカーのクリックで clickMarker の直後に同期で clickMarkers が出る（1 件でも出す）", async ctx => {
      const el = await ctx.mountReady();
      await waitFor(() => el.getViewpoint(), timeout, "a viewpoint");
      await sleep(400); // 起動時の動きを落ち着かせる
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const center = await el.clientPointToLngLat(cx, cy);
      assert(center, "clientPointToLngLat(center) is null");
      el.addMarker({ lnglat: [center.longitude, center.latitude], name: "conformance-click" }, "main");
      const order: string[] = [];
      let marker: unknown;
      let markers: unknown;
      let sameTask: boolean | undefined;
      let inMarkerTask = false;
      const onMarker = (e: Event) => {
        order.push("clickMarker");
        marker = (e as CustomEvent).detail;
        inMarkerTask = true;
        queueMicrotask(() => {
          inMarkerTask = false;
        });
      };
      const onMarkers = (e: Event) => {
        order.push("clickMarkers");
        markers = (e as CustomEvent).detail;
        if (sameTask === undefined) sameTask = inMarkerTask;
      };
      el.addEventListener("clickMarker", onMarker);
      el.addEventListener("clickMarkers", onMarkers);
      ctx.onCleanup(() => {
        el.removeEventListener("clickMarker", onMarker);
        el.removeEventListener("clickMarkers", onMarkers);
      });
      // ピンは POI の位置から上へ描かれる（下端の中央が POI の位置）∴ 少し上を押す。描画の済むまで押し直す
      for (let i = 0; i < 15 && order.length === 0; i++) {
        tapAt(cx, cy - 12);
        await sleep(400);
      }
      await sleep(100);
      same(order.slice(0, 2), ["clickMarker", "clickMarkers"], "event order of a marker click");
      same(sameTask, true, "clickMarkers was dispatched in the same task as clickMarker (synchronously right after it)");
      assert(isMaplatPoi(marker), `clickMarker detail: ${JSON.stringify(marker)}`);
      assert(Array.isArray(markers) && markers.length >= 1 && markers.every(isMaplatPoi), `clickMarkers detail: ${JSON.stringify(markers)}`);
      same((markers as { namespaceID: string }[])[0].namespaceID, (marker as { namespaceID: string }).namespaceID, "clickMarkers[0] equals clickMarker");
      assert(
        (markers as { name?: unknown }[]).some(p => p.name === "conformance-click"),
        "clickMarkers lacks the clicked marker"
      );
    });
  }

  // ---- A-機能 ----
  add("A-機能", "supports() は機能表どおりで、未知の名前は false、作る前でも答える", async () => {
    const el = document.createElement(tag) as El;
    for (const name of LAYER_A_FEATURE_NAMES) {
      same(el.supports(name), !!expectedFeatures[name], `supports("${name}")`);
    }
    same(el.supports("conformance-no-such-feature"), false, "supports(unknown)");
  });

  add("A-機能", "supports() が偽の Pro 固有メソッドは要素に無い（真なら関数）", async () => {
    const el = document.createElement(tag) as El;
    for (const { method, feature } of LAYER_A_PRO_METHODS) {
      same(typeof el[method], el.supports(feature) ? "function" : "undefined", `typeof ${method}`);
    }
  });

  add("A-機能", "未対応の Pro 固有の属性・プロパティはキーごとに 1 回警告して無視する（U3）", async ctx => {
    const unsupported = LAYER_A_PRO_ATTRIBUTES.filter(d => d.feature && !(document.createElement(tag) as El).supports(d.feature));
    for (const def of unsupported) {
      const el = ctx.mount({ bare: true, connect: false });
      const warn = captureWarnings();
      try {
        el.setAttribute(def.attr, "map-warp");
        el.setAttribute(def.attr, "maplat");
        el[def.prop] = "map-warp";
        const mine = warn.messages.filter(m => m.includes(def.attr) || m.includes(def.prop));
        same(mine.length, 1, `warnings for ${def.attr}`);
        assert(!/pro\b/i.test(mine[0]), `the warning names the other implementation: ${mine[0]}`);
      } finally {
        warn.restore();
      }
      same(el[def.prop], undefined, `${def.prop} on an implementation without "${def.feature}"`);
    }
  });

  // ---- A-破棄 ----
  add("A-破棄", "同じタスク内の付け替えでは作り直さない", async ctx => {
    const el = await ctx.mountReady();
    const ready = el.ready;
    let recreated = 0;
    el.addEventListener("lifecycle:setting-loaded", () => recreated++);
    const parent = el.parentElement!;
    parent.removeChild(el);
    parent.appendChild(el);
    await sleep(300);
    assert(el.ready === ready, "ready was replaced");
    same(recreated, 0, "recreated");
    same(typeof el.getTransparency(), "number", "the map is still usable");
  });

  add("A-破棄", "DOM から外すと破棄し、置き直すと新しい ready で作り直す", async ctx => {
    const el = await ctx.mountReady();
    const ready = el.ready;
    const parent = el.parentElement!;
    el.remove();
    await sleep(50);
    let thrown: unknown;
    try {
      el.getTransparency();
    } catch (e) {
      thrown = e;
    }
    assert(isDomException(thrown), "methods still work after removal");
    same(el.currentMapId, null, "currentMapId after removal");
    parent.appendChild(el);
    await sleep(0);
    assert(el.ready !== ready, "ready was not replaced");
    await withTimeout(el.ready, timeout, "ready after re-append");
    assert(el.currentMapId !== null, "currentMapId after re-append");
  });

  add("A-破棄", "付け直しても今の地図のまま（古い map-id から作り直さない）", async ctx => {
    const el = await ctx.mountReady({ attributes: { "map-id": fx.initialMapId } });
    await el.changeMap(fx.otherMapId);
    await waitFor(() => el.currentMapId === fx.otherMapId, timeout, "map switched by changeMap()");
    const parent = el.parentElement!;
    el.remove();
    await sleep(50);
    parent.appendChild(el);
    await withTimeout(el.ready, timeout, "ready after re-append");
    same(el.currentMapId, fx.otherMapId, "currentMapId after re-append");
    same(el.getAttribute("map-id"), fx.otherMapId, "map-id attribute after re-append");
  });

  add("A-破棄", "破棄が決まった時点で ready が新しい Promise に替わり、付け直した直後も前の Promise を返さない", async ctx => {
    const el = await ctx.mountReady();
    const ready = el.ready;
    const parent = el.parentElement!;
    el.remove();
    // 破棄は外した拍の後のマイクロタスクで決まる
    await sleep(0);
    const replaced = el.ready;
    assert(replaced !== ready, "ready was not replaced when the element was disposed");
    const pending = Symbol("pending");
    const raced = await Promise.race([replaced.then(() => "resolved", () => "rejected"), sleep(20).then(() => pending)]);
    same(raced === pending ? "pending" : raced, "pending", "the new ready before re-append");
    parent.appendChild(el);
    // 付け直した直後（作成の前）に読んでも、前の解決済みの Promise ではない
    assert(el.ready === replaced, "ready was replaced again on re-append");
    await withTimeout(el.ready, timeout, "ready after re-append");
    assert(el.appData !== null, "appData is null after the new ready resolved");
    assert(el.currentMapId !== null, "currentMapId is null after the new ready resolved");
  });

  // ---- restoreExtensionKeys（§5.2）----
  add("A-優先", "restoreSession の localStorage から restoreExtensionKeys も読む（期限内のみ）", async ctx => {
    let probe: El | null = await ctx.mountReady();
    const vp = await waitFor(() => probe!.getViewpoint(), timeout, "a viewpoint");
    probe.remove();
    probe = null;
    await sleep(50);
    const keys = ["epoch", "mapID", "x", "y", "zoom", "rotation", "transparency", "hideMarker", "hideLayer", "backgroundID", "conformanceExt"];
    const saved = keys.map(k => [k, localStorage.getItem(k)] as const);
    ctx.onCleanup(() => {
      for (const [k, v] of saved) {
        if (v === null) localStorage.removeItem(k);
        else localStorage.setItem(k, v);
      }
    });
    localStorage.setItem("epoch", `${Math.floor(Date.now() / 1000)}`);
    localStorage.setItem("mapID", fx.initialMapId);
    localStorage.setItem("x", `${vp.x}`);
    localStorage.setItem("y", `${vp.y}`);
    localStorage.setItem("zoom", `${vp.zoom}`);
    localStorage.setItem("rotation", "0");
    localStorage.setItem("transparency", "20");
    localStorage.setItem("conformanceExt", "1");
    const el = await ctx.mountReady({
      attributes: { "restore-session": "" },
      properties: { restoreExtensionKeys: ["conformanceExt", "conformanceMissing"] }
    });
    same(el.initialRestore.conformanceExt, "1", "initialRestore.conformanceExt");
    assert(!("conformanceMissing" in el.initialRestore), "a missing extension key was added");
    same(el.initialRestore.mapID, fx.initialMapId, "initialRestore.mapID");
    same(el.getTransparency(), 20, "transparency from localStorage");
  });

  // 本物の Core は restoreSession で hideMarker（と hideLayer・transparency）も localStorage から読む
  // （src/index.ts の restoreSession）。模擬が mapID・position・transparency しか読まないと、
  // 保存したマーカーの非表示が作り直した要素に戻らない。
  add("A-優先", "restoreSession で保存した hideMarker が、作り直した要素の initialRestore に入る", async ctx => {
    const keys = ["epoch", "mapID", "sourceID", "x", "y", "zoom", "rotation", "transparency", "hideMarker", "hideLayer", "backgroundID", "backID"];
    const saved = keys.map(k => [k, localStorage.getItem(k)] as const);
    ctx.onCleanup(() => {
      for (const [k, v] of saved) {
        if (v === null) localStorage.removeItem(k);
        else localStorage.setItem(k, v);
      }
    });
    // 前の試験の残りを読まないよう、保存する前は消しておく（載った値がこの試験の保存だけであること）
    for (const k of keys) localStorage.removeItem(k);
    // 1 つ目の要素で保存させる（hideAllMarkers → requestUpdateState が restoreSession の localStorage に書く）
    let probe: El | null = await ctx.mountReady({ attributes: { "restore-session": "" } });
    await waitFor(() => probe!.getViewpoint(), timeout, "a viewpoint");
    const updated = nextEvent(probe, "updateState", timeout, e => e.detail?.hideMarker === 1);
    probe.hideAllMarkers();
    await updated;
    same(localStorage.getItem("hideMarker"), "1", "localStorage.hideMarker after hideAllMarkers()");
    probe.remove();
    probe = null;
    await sleep(50);
    // 作り直した要素は、保存した hideMarker を number として initialRestore と state に読む
    const el = await ctx.mountReady({ attributes: { "restore-session": "" } });
    same(el.initialRestore.hideMarker, 1, "initialRestore.hideMarker");
    await waitFor(() => el.state.hideMarker === 1, timeout, "state.hideMarker from the session");
  });

  return cases;
}

/** 1 件の試験の要素と入れ物。 */
class Ctx {
  #cleanups: Array<() => void> = [];
  #records = new WeakMap<Element, CustomEvent[]>();
  #container: HTMLElement;
  constructor(
    private tag: string,
    private fx: LayerAFixture,
    private timeout: number
  ) {
    const container = document.createElement("div");
    container.className = "maplat-conformance-container";
    container.style.cssText = "position:relative;width:480px;height:360px;";
    document.body.appendChild(container);
    this.#container = container;
    this.#cleanups.push(() => container.remove());
  }

  onCleanup(fn: () => void) {
    this.#cleanups.push(fn);
  }

  mount(opts: MountOptions = {}): El {
    const el = document.createElement(this.tag) as El;
    const attrs = { ...(opts.bare ? {} : this.fx.attributes || {}), ...(opts.attributes || {}) };
    const props = { ...(opts.bare ? {} : this.fx.properties || {}), ...(opts.properties || {}) };
    for (const [k, v] of Object.entries(props)) el[k] = v;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (opts.record) {
      const list: CustomEvent[] = [];
      this.#records.set(el, list);
      for (const type of opts.record) el.addEventListener(type, e => list.push(e as CustomEvent));
    }
    if (opts.connect !== false) this.#container.appendChild(el);
    return el;
  }

  async mountReady(opts: MountOptions = {}): Promise<El> {
    const el = this.mount(opts);
    await withTimeout(el.ready, this.timeout, "ready");
    return el;
  }

  recorded(el: Element): CustomEvent[] {
    return this.#records.get(el) || [];
  }

  cleanup() {
    for (const fn of this.#cleanups.reverse()) {
      try {
        fn();
      } catch (_e) {
        // 後始末の失敗は試験の結果に含めない
      }
    }
    this.#cleanups = [];
  }
}

/** describe / it を持つ試験の道具（vitest・jest・mocha・Playwright の test.describe 等）に群を登録する。 */
export function runLayerAConformance(
  options: LayerAConformanceOptions,
  harness: {
    describe: (name: string, fn: () => void) => void;
    it: (name: string, fn: () => Promise<void>, timeout?: number) => void;
  }
) {
  const cases = createLayerAConformanceCases(options);
  const groups = [...new Set(cases.map(c => c.group))];
  harness.describe(`layer A conformance (${options.implementation})`, () => {
    for (const group of groups) {
      harness.describe(group, () => {
        for (const c of cases.filter(x => x.group === group)) {
          harness.it(c.name, () => c.run(), (options.timeout ?? 30000) * 3);
        }
      });
    }
  });
}

/** ページの中で群を順に流し、結果の配列を返す（実ブラウザの e2e から使う）。 */
export async function runLayerAConformanceInPage(
  options: LayerAConformanceOptions,
  onResult?: (result: ConformanceResult) => void
): Promise<ConformanceResult[]> {
  const results: ConformanceResult[] = [];
  for (const c of createLayerAConformanceCases(options)) {
    const start = Date.now();
    let result: ConformanceResult;
    try {
      await c.run();
      result = { group: c.group, name: c.name, ok: true, ms: Date.now() - start };
    } catch (e) {
      result = {
        group: c.group,
        name: c.name,
        ok: false,
        error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
        ms: Date.now() - start
      };
    }
    results.push(result);
    onResult?.(result);
  }
  return results;
}
