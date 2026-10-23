// <maplat-app> の殻（実装に依らない基底クラス）。@maplat/core/common から公開する。
//
// 属性・プロパティの表、作成と破棄、イベントの出し直し、起動時キーの変更不可（U2）、
// Pro 固有キーの警告（U3）、44 の委譲メソッド、状態の読み取りを持つ。地図の中身（旧クラスの
// MaplatApp 相当）は派生クラスが createImplementation() で差す（Core: src/element.ts）。
//
// **このファイルは element_contract.ts と、common の中で OpenLayers を引かないモジュール
// （functions.ts。A19 の createOnceWarner）以外を import しない**（OpenLayers 等を引き込まない。
// spec/common-entry.spec.ts が機械的に確かめる）。
//
// 正本の仕様: NayutaProducts/docs/superpowers/specs/2026-10-10-maplat-web-components-interface.md §3・§6
import { createOnceWarner } from "./functions";
import {
  APP_OPTION_ALIASES,
  ELEMENT_ATTRIBUTES,
  ELEMENT_OWN_EVENTS,
  ELEMENT_PROPERTIES,
  ELEMENT_STARTUP_KEYS,
  LAYER_A_PRO_ATTRIBUTES,
  LAYER_A_PRO_PROPERTIES,
  MAPLAT_APP_EVENTS,
  MAPLAT_APP_METHODS,
  MAPLAT_APP_TAG,
  formatAttributeValue,
  parseAttributeValue,
  unsupportedKeyMessage,
  wrapUiHooksForElement,
  type AttrDef,
  type DisplayMode,
  type EnvelopeSpec,
  type LngLat,
  type MapListItem,
  type MaplatAppDelegatedMethods,
  type MaplatAppElementSettings,
  type PropDef,
  type Restore,
  type Viewpoint
} from "./element_contract";

/**
 * 層 A の中身（旧クラス MaplatApp と同じ形）に求める最小の面。44 の委譲メソッドは同名で持つ。
 * Core の MaplatApp・有償版の MaplatApp・模擬の層 A（src/conformance/mock-layer-a.ts）が満たす。
 */
export interface LayerAImplementation {
  waitReady: Promise<unknown> | unknown;
  addEventListener(type: string, listener: (evt: any) => void): void;
  removeEventListener(type: string, listener: (evt: any) => void): void;
  getGPSEnabled(): boolean;
  [member: string]: any;
}

/** createImplementation() に渡す起動時の材料（§6.1 の優先順位を解いた後の値）。 */
export interface ElementStartupConfig {
  /** 与えられたキーの値（属性・プロパティのみの両方。undefined のキーは載せない） */
  values: Record<string, unknown>;
  /** 移行用の appOption（旧名へ寄せた複製。個別のキーより弱い） */
  appOption: Record<string, any>;
  /**
   * 設定ファイルの中身。setting プロパティ（中身そのもの）＞ app-src（読込の Promise）の順。
   * どちらも無ければ undefined（実装が appId から apps/${appId}.json を読む）。
   */
  setting: unknown;
  /** 地図の入れ物（要素そのもの） */
  element: HTMLElement;
}

/** (ii) のキーを反映するときに、§6.1 の順（プロパティ／属性 ＞ appOption ＞ fallback）で値を引く。 */
export type RuntimeValueResolver = (prop: string, optionKey: string | undefined, fallback: unknown) => unknown;

interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
  reject: (err: unknown) => void;
  settled: boolean;
}
function deferred(): Deferred {
  const d = { settled: false } as Deferred;
  d.promise = new Promise<void>((resolve, reject) => {
    d.resolve = () => {
      d.settled = true;
      resolve();
    };
    d.reject = (err: unknown) => {
      d.settled = true;
      reject(err);
    };
  });
  // 未処理の reject を報告させない（利用側が ready を await しなくてもよい）
  d.promise.catch(() => undefined);
  return d;
}

// 要素の既定の箱（§3.1）。:where() で詳細度 0 にし、利用側の CSS が常に勝つようにする。
const STYLE_ID = "maplat-app-element-style";
const STYLE_TEXT = ":where(maplat-app){display:block;position:relative;overflow:hidden;height:400px;}";

/** 既定の箱の CSS を文書へ一度だけ入れる。 */
export function injectMaplatAppStyle(doc: Document) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLE_TEXT;
  (doc.head || doc.documentElement).appendChild(style);
}

/** 描画 1 回に 1 回の予約（requestAnimationFrame。無い環境では 16 ms 後）。戻り値で取り消す。 */
function scheduleFrame(fn: () => void): () => void {
  if (typeof requestAnimationFrame === "function") {
    const id = requestAnimationFrame(() => fn());
    return () => cancelAnimationFrame(id);
  }
  const id = setTimeout(fn, 16);
  return () => clearTimeout(id);
}

// SSR 等の HTMLElement が無い環境でもモジュールの評価で落とさない
const BaseElement: typeof HTMLElement =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as unknown as typeof HTMLElement);

const COMMON_ATTRS: readonly AttrDef[] = ELEMENT_ATTRIBUTES;
const ALL_ATTRS: readonly AttrDef[] = [...ELEMENT_ATTRIBUTES, ...LAYER_A_PRO_ATTRIBUTES];
const ALL_PROPS: readonly PropDef[] = [...ELEMENT_PROPERTIES, ...LAYER_A_PRO_PROPERTIES];
const ATTR_BY_NAME = new Map(ALL_ATTRS.map(d => [d.attr, d]));
const ATTR_BY_PROP = new Map(ALL_ATTRS.map(d => [d.prop, d]));
const STARTUP_KEYS = new Set(ELEMENT_STARTUP_KEYS);
// §3.8 A1: 変換できないときは undefined でなく null
const NULLISH_RESULT_METHODS = new Set<string>(["clientPointToLngLat", "lngLatToClientPoint"]);

/**
 * <maplat-app> の基底クラス。派生クラスは次を与える:
 *   - `implementation` / `version`（読み取り専用の値）
 *   - `createImplementation(config)`: 中身（LayerAImplementation）を作る
 *   - `listMaps` / `setEnvelopes` / `getMapEnvelope` / `getViewExtent` / `zoomBy`（§3.4.2）
 *   - `features()`: supports() の表（§3.6）
 *   - 必要なら各 hook（applyRuntimeChanges・convertEventDetail・disposeImplementation・
 *     canDisposeDuringStartup 等）と道具（markPending・readKey・dispatchLayerAEvent 等）
 */
// 下の同名の interface で、prototype に置くアクセサ・委譲メソッドの型を足す（実体は static ブロック）
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class MaplatAppElementBase extends BaseElement {
  static get observedAttributes(): readonly string[] {
    return ALL_ATTRS.map(d => d.attr);
  }
  static readonly events = MAPLAT_APP_EVENTS;
  static readonly ownEvents = ELEMENT_OWN_EVENTS;
  static readonly methods = MAPLAT_APP_METHODS;

  /** 実装の種別（§3.6）。 */
  abstract readonly implementation: string;
  /** 実装の版（semver）。 */
  abstract readonly version: string;

  #impl: LayerAImplementation | null = null;
  #ready: Deferred = deferred();
  #isReady = false;
  // プロパティのみのキーの値
  #props = new Map<string, unknown>();
  // 起動した後の、起動時だけ効くキーの値（U2: 読み取りはこの値を返す）
  #startupValues: Map<string, unknown> | null = null;
  // 警告はキーごとに 1 回（A19: 旧クラスと同じ createOnceWarner を使う）
  #warner = createOnceWarner();
  // 反映待ちの (ii) キー（同じ拍の変更・ready 前の変更をまとめる）
  #pending = new Set<string>();
  #needsCreate = false;
  #flushScheduled = false;
  #generation = 0;
  #unsubscribe: (() => void) | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #disposing: Promise<void> = Promise.resolve();
  #lastViewpoint: Viewpoint | null = null;
  #lastGpsEnabled: boolean | null = null;
  // 属性の書き戻しの最中（attributeChangedCallback で二重に扱わない）
  #reflecting = false;
  // 描画 1 回にまとめて書き戻す状態のキー（AttrDef.state === "frame"）と、書く時点の値の読み口
  #frameReflections = new Map<string, () => unknown>();
  #cancelFrame: (() => void) | null = null;

  // ---- ライフサイクル ----

  connectedCallback() {
    // 登録前に代入されたプロパティを拾い直す（lazy property upgrade）
    for (const def of ALL_ATTRS) this.#upgradeProperty(def.prop);
    for (const def of ALL_PROPS) this.#upgradeProperty(def.prop);
    for (const def of ALL_ATTRS) {
      // HTML に書かれた未対応の Pro 固有属性（attributeChangedCallback は定義前の値でも呼ばれるが、念のため）
      if (def.feature && this.hasAttribute(def.attr)) this.#checkFeatureKey(def, "attribute");
    }
    if (this.ownerDocument) injectMaplatAppStyle(this.ownerDocument);
    if (!this.#impl) {
      // 作成は同じ拍の属性・プロパティの設定をまとめてから行う
      this.#needsCreate = true;
      this.#scheduleFlush();
    }
    this.#observeResize();
  }

  disconnectedCallback() {
    // DOM 内の移動（外して同じ拍で差し戻す）では壊さない。1 拍待ってまだ外れていれば破棄
    queueMicrotask(() => {
      if (!this.isConnected) this.#teardown();
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue || this.#reflecting) return;
    const def = ATTR_BY_NAME.get(name);
    if (!def) return;
    if (def.feature && !this.#checkFeatureKey(def, "attribute")) return;
    this.#onKeyChanged(def.prop, `attribute "${name}"`);
  }

  static {
    const proto = MaplatAppElementBase.prototype as any;
    for (const def of ALL_ATTRS) {
      Object.defineProperty(proto, def.prop, {
        configurable: true,
        enumerable: true,
        get(this: MaplatAppElementBase) {
          if (def.feature && !this.supports(def.feature)) return undefined;
          return this.#readKey(def.prop);
        },
        set(this: MaplatAppElementBase, value: unknown) {
          if (def.feature && !this.#checkFeatureKey(def, "property")) return;
          if (this.#rejectStartupWrite(def.prop, `property "${def.prop}"`)) return;
          const text = formatAttributeValue(def, value);
          this.#reflecting = true;
          try {
            if (text == null) this.removeAttribute(def.attr);
            else this.setAttribute(def.attr, text);
          } finally {
            this.#reflecting = false;
          }
          this.#onKeyChanged(def.prop, null);
        }
      });
    }
    for (const def of ALL_PROPS) {
      Object.defineProperty(proto, def.prop, {
        configurable: true,
        enumerable: true,
        get(this: MaplatAppElementBase) {
          if (def.feature && !this.supports(def.feature)) return undefined;
          return this.#readKey(def.prop);
        },
        set(this: MaplatAppElementBase, value: unknown) {
          if (def.feature && !this.#checkFeatureKey(def, "property")) return;
          if (this.#rejectStartupWrite(def.prop, `property "${def.prop}"`)) return;
          if (value == null) this.#props.delete(def.prop);
          else this.#props.set(def.prop, value);
          this.#onKeyChanged(def.prop, null);
        }
      });
    }
    // 44 の委譲メソッド（§3.4.1）
    for (const name of MAPLAT_APP_METHODS) {
      Object.defineProperty(proto, name, {
        configurable: true,
        writable: true,
        enumerable: false,
        value(this: MaplatAppElementBase, ...args: unknown[]) {
          const impl = this.#requireImpl(name);
          const call = () => {
            const result = impl[name](...args);
            if (name === "handleGPS") this.#checkGpsEnabled();
            // §6.2.3: メソッドで変えた透過度も属性へ書き戻す（描画 1 回にまとめる）
            if (name === "setTransparency") this.#reflectTransparency();
            return this.convertMethodResult(name, result);
          };
          // §3.4.1: 作成中なら ready を待ってから実行する
          if (!this.#isReady) return this.#ready.promise.then(call);
          return call();
        }
      });
    }
  }

  // ---- 状態の読み取り（§3.3）----

  /**
   * 地図の準備完了で解決する。要素を置き直したときだけ新しい Promise になる: DOM から外して破棄が
   * 決まった時点（外した拍の後のマイクロタスク）で、前の Promise が決着していれば新しい Promise に替わる
   * （同じ拍の付け替えでは破棄しないので替わらない）。
   */
  get ready(): Promise<void> {
    return this.#ready.promise;
  }

  /** 設定ファイルの中身（凍結した浅い複製）。lifecycle:appdata-ready の発火時から読める。 */
  get appData(): Readonly<Record<string, any>> | null {
    const data = this.#impl?.appData;
    return data ? Object.freeze({ ...(data as any) }) : null;
  }

  /** 起動時に使った復元値（restore・map-id・transparency・restoreSession の localStorage）。 */
  get initialRestore(): Readonly<Restore> {
    return Object.freeze({ ...((this.#impl?.initialRestore as any) || {}) });
  }

  /** 現在の状態（旧 stateBuffer の複製）。変化は updateState イベントで知る。 */
  get state(): Readonly<Restore> {
    return Object.freeze({ ...((this.#impl?.stateBuffer as any) || {}) });
  }

  /** 表示中の地図の mapID。 */
  get currentMapId(): string | null {
    const impl = this.#impl;
    if (!impl || typeof impl.currentMapInfo !== "function") return null;
    try {
      return (impl.currentMapInfo()?.mapID as string | undefined) ?? null;
    } catch (_e) {
      return null;
    }
  }

  /** 現在の視点（最後の changeViewpoint の detail）。 */
  get viewpoint(): Viewpoint | null {
    return this.#lastViewpoint ? { ...this.#lastViewpoint } : null;
  }

  /** GPS の追跡が有効か（getGPSEnabled() と同じ）。 */
  get gpsEnabled(): boolean {
    return this.#impl ? !!this.#impl.getGPSEnabled() : false;
  }

  // ---- 自前のメソッド（§3.4.2）----

  /** 現在の視点。地図の準備前は null。 */
  getViewpoint(): Viewpoint | null {
    return this.viewpoint;
  }

  /** 機能の問い合わせ（§3.6）。未知の名前は false。地図の準備前でも答える。 */
  supports(feature: string): boolean {
    return this.features()[feature] === true;
  }

  abstract listMaps(): MapListItem[];
  abstract setEnvelopes(items: EnvelopeSpec[]): void;
  abstract getMapEnvelope(mapID: string): LngLat[] | null;
  abstract getViewExtent(): LngLat[] | null;
  abstract zoomBy(delta: number): void;
  /** 既定のピンの画像（実装確認 6。地図の準備前でも答える）。selected なら選択中の画像。 */
  abstract getDefaultPinIcon(selected?: boolean): string;

  // ---- 派生クラスが差す hook ----

  /** supports() の表（§3.6）。 */
  protected abstract features(): Readonly<Record<string, boolean>>;

  /** 中身を作る。投げたら ready が reject される。 */
  protected abstract createImplementation(config: ElementStartupConfig): LayerAImplementation;

  /** 中身を破棄する（既定では初期化の完了後に呼ぶ。canDisposeDuringStartup も見よ）。既定は impl.remove()。 */
  protected disposeImplementation(impl: LayerAImplementation): void {
    impl.remove?.();
  }

  /**
   * 中身が初期化の途中でも破棄できるか（破棄の口が途中の初期化を中断して同期で後始末を済ませる実装なら true）。
   * 既定の false では、初期化の途中で外された中身は waitReady の完了を待ってから破棄し、次の中身はその後に作る
   * （途中で消すと残りの初期化が消えた箱へ書き込む実装のため）。true なら外した時点で破棄し、待たない。
   */
  protected canDisposeDuringStartup(): boolean {
    return false;
  }

  /** 中身を作った直後（イベントの購読の後・ready の前）。 */
  protected onImplementationCreated(_impl: LayerAImplementation): void {
    // 既定では何もしない
  }

  /** 中身の準備が済んだとき（ready の解決の直前）。 */
  protected onImplementationReady(_impl: LayerAImplementation): void {
    // 既定では何もしない
  }

  /** 中身を外すとき（購読の解除と同時。破棄の前）。 */
  protected onImplementationDetached(_impl: LayerAImplementation): void {
    // 既定では何もしない
  }

  /** 中身のイベントを出し直した直後（派生クラスの控え・描き直しに使う）。 */
  protected onImplementationEvent(_type: string, _detail: unknown, _impl: LayerAImplementation): void {
    // 既定では何もしない
  }

  /** 要素の大きさが変わったとき（ready 後）。 */
  protected onResize(_impl: LayerAImplementation): void {
    // 既定では何もしない
  }

  /** DOM だけで当てるキー（AttrDef.dom）が変わったとき・中身を作った直後。 */
  protected applyDomKeys(): void {
    // 既定では何もしない
  }

  /**
   * 起動後の (ii) のキーの変更を中身へ反映する。map-id・transparency は基底が先に当てる。
   * resolve は §6.1 の順（プロパティ／属性 ＞ appOption ＞ fallback）で値を引く。
   */
  protected applyRuntimeChanges(
    _impl: LayerAImplementation,
    _pending: ReadonlySet<string>,
    _resolve: RuntimeValueResolver
  ): void {
    // 既定では何もしない
  }

  /** 中身の detail → 要素のイベントの detail（§3.5）。派生クラスは super を呼んでから足す。 */
  protected convertEventDetail(type: string, detail: any, _impl: LayerAImplementation): unknown {
    if (type === "lifecycle:error") {
      return { phaseId: detail?.phaseId, error: detail?.error };
    }
    if (type.startsWith("lifecycle:")) {
      // 内部の core・mapDivDocument・uiHookResults を載せない
      return { phaseId: detail?.phaseId, appData: detail?.appData ?? null };
    }
    return detail;
  }

  /** 委譲メソッドの戻り値の調整（§3.8 A1: undefined → null）。 */
  protected convertMethodResult(name: string, result: unknown): unknown {
    if (NULLISH_RESULT_METHODS.has(name)) {
      return Promise.resolve(result).then(v => (v === undefined ? null : v));
    }
    return result;
  }

  /** 中身が出し直す対象のイベント名。既定は MAPLAT_APP_EVENTS。 */
  protected forwardedEvents(): readonly string[] {
    return MAPLAT_APP_EVENTS;
  }

  // ---- 派生クラスが使う道具 ----

  /** 今の中身（作る前・破棄の後は null）。層 A の公開面ではない。 */
  protected currentImplementation(): LayerAImplementation | null {
    return this.#impl;
  }

  /** 中身の準備が済んでいるか。 */
  protected isImplementationReady(): boolean {
    return this.#isReady;
  }

  /** 中身が無ければ「まだ作っていない」の例外を投げる（§3.4.1）。 */
  protected requireImplementation(name: string): LayerAImplementation {
    return this.#requireImpl(name);
  }

  /** キーの現在値（起動時キーは起動後なら起動時の値）。 */
  protected readKey(prop: string): unknown {
    return this.#readKey(prop);
  }

  /**
   * 実装が実際に使っているキーの値（任意）。`{ value }` を返すと #readKey はその値を返す。
   * 既定は undefined（実装から値を受け取らない＝今までどおり属性・起動時の値を返す）。
   * 設定ファイル等から実装が読んだ値と要素の見せかけの値が食い違う実装だけが上書きする（Core の互換モード）。
   */
  protected implementationKeyValue(
    _prop: string,
    _impl: LayerAImplementation
  ): { value: unknown } | undefined {
    return undefined;
  }

  /**
   * キーを「反映待ち」に積む（ready 後に applyRuntimeChanges へ渡る）。作成時の材料で渡せないキーを
   * 準備の完了後に当てたいとき、onImplementationReady から呼ぶ（そこで積んだ分は ready の解決の直後に反映する）。
   */
  protected markPending(prop: string): void {
    this.#pending.add(prop);
    this.#scheduleFlush();
  }

  /** 要素から DOM の CustomEvent を出す（§3.5: bubbles・composed なし・cancelable なし）。 */
  protected dispatchLayerAEvent(type: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: false, cancelable: false, detail }));
  }

  /**
   * 内部の操作（UI・メソッド・状態 URL の復元・中身自身の切り替え）で変わった状態を属性へ書き戻す
   * （§3.3・§6.2.3。対象は AttrDef.state を持つキー: map-id・transparency・Pro の display-mode）。
   * 書き戻しは属性の変更として扱わない（attributeChangedCallback が何もしない＝二重に処理しない）。
   * state が "frame" のキーは描画 1 回につき 1 回にまとめ、書く時点で read() から値を読む（最後の値が残る）。
   * 利用者の変更が反映待ちのキー・値が無い（undefined）・既に同じ値のときは書かない。
   */
  protected reflectState(prop: string, read: () => unknown): void {
    const def = ATTR_BY_PROP.get(prop);
    if (!def?.state) return;
    if (def.state !== "frame") {
      this.#writeReflected(def, read());
      return;
    }
    this.#frameReflections.set(prop, read);
    if (this.#cancelFrame) return;
    this.#cancelFrame = scheduleFrame(() => {
      this.#cancelFrame = null;
      this.#flushFrameReflections();
    });
  }

  /** 同じ鍵では 1 回だけ警告する（名前は公開の基底クラスのメソッドなので残す。A19）。 */
  protected warnOnce(key: string, message: string) {
    this.#warner(key, message);
  }

  // ---- 内部 ----

  #writeReflected(def: AttrDef, value: unknown) {
    if (value === undefined || value === null) return;
    // 利用者の変更が反映待ち（ready 前・同じ拍）なら、その変更を先に通す（反映の後にもう一度書き戻される）
    if (this.#pending.has(def.prop)) return;
    if (def.feature && !this.supports(def.feature)) return;
    if (this.#currentValue(def.prop) === value) return;
    const text = formatAttributeValue(def, value);
    if (text == null) return;
    this.#reflecting = true;
    try {
      this.setAttribute(def.attr, text);
    } finally {
      this.#reflecting = false;
    }
  }

  #flushFrameReflections() {
    if (this.#cancelFrame) {
      this.#cancelFrame();
      this.#cancelFrame = null;
    }
    const entries = [...this.#frameReflections];
    this.#frameReflections.clear();
    for (const [prop, read] of entries) {
      const def = ATTR_BY_PROP.get(prop);
      if (def) this.#writeReflected(def, read());
    }
  }

  /** 透過度を属性へ書き戻す（描画 1 回にまとめる。値は書く時点の getTransparency()）。 */
  #reflectTransparency() {
    this.reflectState("transparency", () => {
      const impl = this.#impl;
      if (!impl || typeof impl.getTransparency !== "function") return undefined;
      try {
        const n = Number(impl.getTransparency());
        return Number.isFinite(n) ? n : undefined;
      } catch (_e) {
        return undefined;
      }
    });
  }

  #requireImpl(name: string): LayerAImplementation {
    const impl = this.#impl;
    if (!impl) {
      throw new DOMException(
        `<${MAPLAT_APP_TAG}>.${name}(): the map is not created yet (connect the element with app-id, app-src or setting, then await element.ready).`,
        "InvalidStateError"
      );
    }
    return impl;
  }

  /** Pro 固有キー（U3）: 対応していれば true。していなければキーごとに 1 回警告して false。 */
  #checkFeatureKey(def: AttrDef | PropDef, via: "attribute" | "property"): boolean {
    if (!def.feature || this.supports(def.feature)) return true;
    this.warnOnce(`unsupported:${def.prop}`, unsupportedKeyMessage(def as { attr?: string; prop: string }, via));
    return false;
  }

  /** 起動後の起動時キーへの書き込みなら警告して true を返す（U2）。 */
  #rejectStartupWrite(prop: string, what: string): boolean {
    if (!this.#startupValues || !STARTUP_KEYS.has(prop)) return false;
    this.warnOnce(
      `startup:${prop}`,
      `<${MAPLAT_APP_TAG}>: ${what} is fixed at startup and cannot be changed after the map is created; the change was ignored.`
    );
    return true;
  }

  #readKey(prop: string): unknown {
    // 実装が「実際に使っている値」を返せるなら、それを優先する（任意。実装が持たなければ今までどおり）
    if (this.#impl && this.#isReady) {
      const actual = this.implementationKeyValue(prop, this.#impl);
      if (actual) return actual.value;
    }
    if (this.#startupValues && this.#startupValues.has(prop)) return this.#startupValues.get(prop);
    return this.#currentValue(prop);
  }

  #currentValue(prop: string): unknown {
    const attrDef = ATTR_BY_PROP.get(prop);
    if (attrDef) {
      const raw = this.getAttribute(attrDef.attr);
      return parseAttributeValue(attrDef, raw, msg => this.warnOnce(`parse:${attrDef.attr}:${raw}`, msg));
    }
    return this.#props.get(prop);
  }

  #onKeyChanged(prop: string, attrLabel: string | null) {
    if (this.#startupValues && STARTUP_KEYS.has(prop)) {
      // 属性の起動後の変更（プロパティ経由は setter で弾いている）
      if (attrLabel) this.#rejectStartupWrite(prop, attrLabel);
      return;
    }
    if (STARTUP_KEYS.has(prop)) {
      // 起動前: 作成の材料が揃ったら作る
      if (this.isConnected) {
        this.#needsCreate = true;
        this.#scheduleFlush();
      }
      return;
    }
    if (ATTR_BY_PROP.get(prop)?.dom) {
      // DOM だけの話なので ready を待たずに当てる
      this.applyDomKeys();
      return;
    }
    this.#pending.add(prop);
    this.#scheduleFlush();
  }

  #upgradeProperty(prop: string) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = (this as any)[prop];
      delete (this as any)[prop];
      (this as any)[prop] = value;
    }
  }

  #scheduleFlush() {
    if (this.#flushScheduled) return;
    this.#flushScheduled = true;
    queueMicrotask(() => {
      this.#flushScheduled = false;
      this.#flush();
    });
  }

  #canCreate() {
    return !!(
      this.#currentValue("appId") ||
      this.#currentValue("appSrc") ||
      this.#props.get("setting") ||
      this.#props.get("appOption")
    );
  }

  #flush() {
    if (!this.isConnected) return;
    if (this.#needsCreate) {
      if (this.#impl) {
        this.#needsCreate = false;
      } else {
        if (!this.#canCreate()) return; // app-id か app-src か setting が来るまで待つ
        this.#needsCreate = false;
        this.#create();
        return;
      }
    }
    if (this.#impl && this.#isReady) this.#applyPending();
  }

  /** 起動時の材料を組む（§6.1 の優先順位: 個別のキー ＞ appOption ＞ 設定ファイル ＞ 既定値）。 */
  #buildConfig(): ElementStartupConfig {
    const base = (this.#props.get("appOption") as Record<string, any> | undefined) || {};
    const appOption: Record<string, any> = { ...base };
    for (const [from, to] of Object.entries(APP_OPTION_ALIASES)) {
      if (appOption[from] !== undefined) {
        if (appOption[to] === undefined) appOption[to] = appOption[from];
        delete appOption[from];
      }
    }
    const values: Record<string, unknown> = {};
    for (const def of COMMON_ATTRS) {
      const v = this.#currentValue(def.prop);
      if (v !== undefined) values[def.prop] = v;
    }
    for (const def of LAYER_A_PRO_ATTRIBUTES) {
      if (def.feature && !this.supports(def.feature)) continue;
      const v = this.#currentValue(def.prop);
      if (v !== undefined) values[def.prop] = v;
    }
    for (const def of ALL_PROPS) {
      if (def.feature && !this.supports(def.feature)) continue;
      const v = this.#props.get(def.prop);
      if (v !== undefined) values[def.prop] = v;
    }
    // C2-10: 要素経路の uiHooks は context.core / context.mapDivDocument を要素にする（仕様 §3.2）。
    // プロパティ（values.uiHooks）と移行用の appOption プロパティの中の uiHooks の両方を包む（Minor 4）。
    // フックのオブジェクトは書き換えず、写しを渡す（旧クラスの経路は変わらない。C5）
    if (values.uiHooks) {
      values.uiHooks = wrapUiHooksForElement(values.uiHooks as Record<string, any>, this);
    }
    if (appOption.uiHooks) {
      appOption.uiHooks = wrapUiHooksForElement(appOption.uiHooks as Record<string, any>, this);
    }
    // 設定ファイルの場所: setting ＞ app-src ＞ apps/${appId}.json（§6.1）
    let setting: unknown = values.setting ?? appOption.setting;
    const appSrc = values.appSrc as string | undefined;
    if (!setting && appSrc) {
      setting = fetch(appSrc).then(res => {
        if (!res.ok) throw new Error(`<${MAPLAT_APP_TAG}>: failed to load ${appSrc} (${res.status})`);
        return res.json();
      });
    }
    return { values, appOption, setting, element: this };
  }

  #create() {
    const generation = ++this.#generation;
    if (this.#ready.settled) this.#ready = deferred();
    const ready = this.#ready;
    // 作成時点の値は材料に織り込むので、溜めていた変更は捨てる
    this.#pending.clear();
    // U2: ここから起動時のキーは変更不可。読み取りは起動時の値を返す
    const snapshot = new Map<string, unknown>();
    for (const key of ELEMENT_STARTUP_KEYS) snapshot.set(key, this.#currentValue(key));
    this.#startupValues = snapshot;
    // 前のインスタンスの破棄（初期化途中なら完了待ち）が済んでから作る
    this.#disposing.then(() => {
      if (generation !== this.#generation || !this.isConnected) return;
      let impl: LayerAImplementation;
      try {
        impl = this.createImplementation(this.#buildConfig());
      } catch (err) {
        ready.reject(err);
        return;
      }
      this.#impl = impl;
      this.#isReady = false;
      this.#lastViewpoint = null;
      this.#lastGpsEnabled = null;
      this.#unsubscribe = this.#forwardEvents(impl);
      this.onImplementationCreated(impl);
      this.applyDomKeys();
      Promise.resolve(impl.waitReady).then(
        () => {
          if (generation !== this.#generation) return;
          this.#isReady = true;
          this.onImplementationReady(impl);
          this.#checkGpsEnabled();
          ready.resolve();
          this.#applyPending();
        },
        (err: unknown) => {
          if (generation !== this.#generation) return;
          ready.reject(err);
        }
      );
    });
  }

  /** (ii) のキーの変更を中身へ反映する（ready 後）。 */
  #applyPending() {
    const impl = this.#impl;
    if (!impl || this.#pending.size === 0) return;
    const pending = new Set(this.#pending);
    this.#pending.clear();
    const base = (this.#props.get("appOption") as Record<string, any> | undefined) || {};
    const resolve: RuntimeValueResolver = (prop, optionKey, fallback) => {
      const v = this.#currentValue(prop);
      if (v !== undefined) return v;
      if (optionKey && base[optionKey] != null) return base[optionKey];
      return fallback;
    };
    if (pending.has("mapId")) {
      const mapId = this.#currentValue("mapId") as string | undefined;
      // 表示中の地図は中身の currentMapInfo() で見る（メソッド経由で先に切り替わっていた場合は何もしない）
      let current: string | undefined;
      try {
        current = impl.currentMapInfo?.()?.mapID;
      } catch (_e) {
        current = undefined;
      }
      if (mapId && mapId !== current) {
        // 一覧がまだ無い（中身が一覧を出さない）ときは中身の changeMap に任せる
        const maps = this.listMaps();
        if (maps.length > 0 && !maps.some(m => m.mapID === mapId)) {
          console.warn(`<${MAPLAT_APP_TAG}>: map-id "${mapId}" is not a usable map of this app; ignored.`);
          // 属性は今の地図へ戻す（el.mapId は表示中の地図を返す。§3.3）
          if (current) this.reflectState("mapId", () => current);
        } else {
          void impl.changeMap(mapId);
        }
      }
    }
    if (pending.has("transparency")) {
      const n = (this.#currentValue("transparency") as number | undefined) ?? 0;
      impl.setTransparency(n);
    }
    this.applyRuntimeChanges(impl, pending, resolve);
  }

  #checkGpsEnabled() {
    const impl = this.#impl;
    if (!impl) return;
    const enabled = !!impl.getGPSEnabled();
    if (this.#lastGpsEnabled === null) {
      this.#lastGpsEnabled = enabled;
      if (!enabled) return;
    } else if (this.#lastGpsEnabled === enabled) {
      return;
    }
    this.#lastGpsEnabled = enabled;
    this.dispatchLayerAEvent("gpsEnabledChanged", { enabled });
  }

  #forwardEvents(impl: LayerAImplementation): () => void {
    const listeners: Array<[string, (evt: any) => void]> = [];
    for (const type of this.forwardedEvents()) {
      const listener = (evt: any) => {
        const raw = evt && "detail" in evt ? evt.detail : null;
        if (type === "changeViewpoint" && raw) this.#lastViewpoint = { ...raw };
        // §6.2.3: 地図が替わったら map-id へ書き戻す（要素の mapChanged のリスナが el.mapId で新しい地図を読めるよう先に）
        if (type === "mapChanged") {
          const mapID = (raw as { mapID?: unknown } | null)?.mapID;
          this.reflectState("mapId", () => (typeof mapID === "string" && mapID !== "" ? mapID : this.currentMapId));
        }
        // Pro 固有の表示モード（supports("display-mode") の実装だけが modechange を出す。U3）
        if (type === "modechange") {
          const mode = (raw as { mode?: unknown } | null)?.mode;
          this.reflectState("displayMode", () => (typeof mode === "string" ? mode : undefined));
        }
        // 透過度の変化（状態 URL の復元・地図の切り替えで当て直した値を含む）
        if (type === "updateState" && raw && typeof raw === "object" && "transparency" in raw) {
          this.#reflectTransparency();
        }
        const detail = this.convertEventDetail(type, raw, impl);
        this.dispatchLayerAEvent(type, detail);
        if (type.startsWith("gps_")) this.#checkGpsEnabled();
        this.onImplementationEvent(type, raw, impl);
      };
      impl.addEventListener(type, listener);
      listeners.push([type, listener]);
    }
    return () => {
      for (const [type, listener] of listeners) impl.removeEventListener(type, listener);
    };
  }

  #observeResize() {
    if (this.#resizeObserver || typeof ResizeObserver === "undefined") return;
    this.#resizeObserver = new ResizeObserver(() => {
      const impl = this.#impl;
      if (!impl || !this.#isReady) return;
      this.onResize(impl);
    });
    this.#resizeObserver.observe(this);
  }

  #teardown() {
    // 描画待ちの書き戻しは今の中身の値で済ませる（付け直したときに古い属性から作り直さない。§3.3）
    this.#flushFrameReflections();
    this.#generation++;
    this.#needsCreate = false;
    // §3.3: 破棄が決まった時点で ready を新しい Promise にする（置き直した直後に前の解決済みの Promise を
    // 返さない）。まだ決着していない ready（作成の途中で外された）はそのまま次の作成で解決させる
    if (this.#ready.settled) this.#ready = deferred();
    this.#isReady = false;
    // 次の接続で作り直すときは、その時点の属性・プロパティを起動時の値にする
    this.#startupValues = null;
    this.#pending.clear();
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
    }
    const impl = this.#impl;
    if (!impl) return;
    this.#impl = null;
    this.#isReady = false;
    if (this.#unsubscribe) {
      this.#unsubscribe();
      this.#unsubscribe = null;
    }
    this.onImplementationDetached(impl);
    const dispose = () => this.disposeImplementation(impl);
    if (this.canDisposeDuringStartup()) {
      // 途中の初期化を中断できる実装は、外した時点で破棄する（完了を待たない）
      try {
        dispose();
      } catch (err) {
        console.warn(`<${MAPLAT_APP_TAG}>: failed to dispose the map`, err);
      }
      return;
    }
    // 初期化途中の破棄は完了を待つ（途中で消すと、残りの初期化が消えた箱へ書き込む）
    this.#disposing = this.#disposing.then(() =>
      Promise.resolve(impl.waitReady)
        .then(dispose, dispose)
        .catch(err => {
          console.warn(`<${MAPLAT_APP_TAG}>: failed to dispose the map`, err);
        })
    );
  }
}

/** Pro 固有のキー（U3）。対応しない実装では常に undefined（代入は警告して無視）。 */
export interface MaplatAppElementProSettings {
  displayMode: DisplayMode | undefined;
}

// 設定のキーのアクセサと 44 の委譲メソッドの型（実体は上の static ブロックで prototype に置く）
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface MaplatAppElementBase
  extends MaplatAppDelegatedMethods,
    MaplatAppElementSettings,
    MaplatAppElementProSettings {}

/**
 * 要素を登録する（二重登録は何もしない。別の実装が登録済みなら警告して上書きしない。§3.1）。
 * @returns 登録したら true
 */
export function defineMaplatAppElementOnce(
  ctor: CustomElementConstructor,
  tagName: string = MAPLAT_APP_TAG,
  label = "this implementation"
): boolean {
  if (typeof customElements === "undefined") return false;
  const existing = customElements.get(tagName);
  if (existing) {
    if (existing !== ctor) {
      console.warn(`<${tagName}> is already defined by another implementation; ${label} did not redefine it.`);
    }
    return false;
  }
  customElements.define(tagName, ctor);
  return true;
}
