// <maplat-app>: MaplatCore の Custom Element（スクラッチ実装・ライブラリ不使用・light DOM）。
//
// 有償版（別実装）と呼び出しを揃えるための共通の入り口（層 A）。当面は既存クラス MaplatApp と
// 並べて公開し、要素は内部で MaplatApp を 1 つ持って委譲する。
//
//   import "@maplat/core/element";            // 副作用で <maplat-app> を登録
//   <maplat-app app-id="morioka"></maplat-app>
//
// 実装に依らない殻（属性・プロパティの表・作成と破棄・イベントの出し直し・起動時キーの変更不可）は
// src/element_base.ts の MaplatAppElementBase（@maplat/core/common から公開）にあり、このファイルは
// 中身の MaplatApp（OpenLayers）を差すことと、地図に依る新設 API だけを持つ。
//
// 公開 API は docs/api/maplat-app.md を参照。
// 既定のピンの画像と投影の変換は本体の入口から読む（要素の束に画像・OL を二重に入れない。
// 本体の束は外部化されている）
import { MaplatApp, defaultPinIcon, mercToLngLat, type ElementImplementationInternals } from "./index";
import {
  MaplatAppElementBase,
  defineMaplatAppElementOnce,
  type ElementStartupConfig,
  type LayerAImplementation,
  type RuntimeValueResolver
} from "./element_base";
import {
  ELEMENT_ATTRIBUTES as ATTRS,
  ELEMENT_PROPERTIES as PROPS,
  MAPLAT_APP_TAG,
  featuresOf,
  type EnvelopeSpec,
  type LngLat,
  type MapListItem,
  type MaplatAppElement as MaplatAppElementContract,
  type Viewpoint
} from "./element_contract";

// 従来どおり "@maplat/core/element" からも名前の表を読めるようにする（正本は element_contract.ts）
export {
  MAPLAT_APP_EVENTS,
  ELEMENT_OWN_EVENTS,
  MAPLAT_APP_METHODS,
  ELEMENT_OWN_METHODS,
  MAPLAT_APP_TAG,
  ELEMENT_ATTRIBUTES,
  ELEMENT_PROPERTIES,
  ELEMENT_STARTUP_KEYS,
  LAYER_A_PRO_ATTRIBUTES
} from "./element_contract";
export type { MaplatAppEventName, MaplatAppMethodName } from "./element_contract";

// @maplat/core の版。ビルド時に vite の define で埋め込む（vite.config.ts・vitest.config.ts）。
// package.json を import すると型定義の出力の根が変わる（dist/src/ 配下になる）ので使わない。
declare const __MAPLAT_CORE_VERSION__: string | undefined;
const PACKAGE_VERSION: string =
  typeof __MAPLAT_CORE_VERSION__ !== "undefined" ? __MAPLAT_CORE_VERSION__ : "0.0.0-dev";

/** supports() の機能表（Core の列）。 */
const CORE_FEATURES: Readonly<Record<string, boolean>> = Object.freeze(featuresOf("core"));

type CoreApp = MaplatApp;

/** @deprecated 共通の型 Viewpoint（@maplat/core/common）を使う。 */
export type MaplatViewpoint = Viewpoint;
/** @deprecated 共通の型 MapListItem（@maplat/core/common）を使う。 */
export type MaplatMapListItem = MapListItem;

const isFiniteXY = (c: unknown): c is [number, number] =>
  Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1]);

export class MaplatAppElement extends MaplatAppElementBase implements MaplatAppElementContract {
  /** 実装の種別。有償版は "core-pro"。 */
  readonly implementation = "core" as const;
  /** 実装の版（@maplat/core の版）。 */
  readonly version: string = PACKAGE_VERSION;

  // 枠線（setEnvelopes）の最後の指定。地図を切り替えたら描き直す
  #envelopes: EnvelopeSpec[] = [];
  #envelopeSeq = 0;
  // 画面の 4 隅の経緯度（changeViewpoint のたびに非同期で求めて控える。getViewExtent は同期）
  #viewExtent: LngLat[] | null = null;
  #viewExtentSeq = 0;
  #unhookMove: (() => void) | null = null;
  // 互換モード（旧クラス MaplatApp の読み方・警告に合わせる）。appOption.__maplatCompat = true のときだけ
  #compat = false;

  /**
   * 内部の MaplatApp。
   * @internal 移行期の逃げ道。層 A の公開面に含めない。メジャー版で消す。
   */
  get app(): CoreApp | null {
    return this.currentImplementation() as CoreApp | null;
  }

  // ---- 新設メソッド ----

  /** 使える地図の一覧（設定ファイルの sources の順）。地図の準備前は []。 */
  listMaps(): MapListItem[] {
    const app = this.currentImplementation() as any;
    if (!app?.cacheHash) return [];
    return Object.entries(app.cacheHash as Record<string, any>).map(([key, source]: [string, any]) => ({
      mapID: source.mapID ?? key,
      label: source.label ?? source.mapID ?? key,
      thumbnail: source.thumbnail ?? null,
      isBasemap: !!source.isBasemap?.(),
      isOldMap: !(source.isWmts?.() ?? true),
      isOverlay: !!source.isWmts?.() && !source.isBasemap?.(),
      hasEnvelope: !!source.envelope,
      cacheEnable: !!app.getMapCacheEnable?.(source.mapID ?? key)
    }));
  }

  /** 地図の範囲（経緯度の多角形。最後の頂点は最初の頂点を繰り返さない）。範囲を持たない地図は null。 */
  getMapEnvelope(mapID: string): LngLat[] | null {
    const source = (this.currentImplementation() as any)?.cacheHash?.[mapID];
    const ring: unknown = source?.envelope?.geometry?.coordinates?.[0];
    if (!Array.isArray(ring) || ring.length < 3) return null;
    const coords = ring.filter(isFiniteXY);
    if (coords.length > 1) {
      const [f, l] = [coords[0], coords[coords.length - 1]];
      if (f[0] === l[0] && f[1] === l[1]) coords.pop();
    }
    return coords.map(merc => {
      const [longitude, latitude] = mercToLngLat(merc);
      return { longitude, latitude };
    });
  }

  /**
   * 画面の 4 隅の経緯度（左上・右上・右下・左下）。地図の準備前・変換できないときは null。
   * Core の座標変換は非同期なので、視点が変わるたび（changeViewpoint）に求めて控えた値を返す。
   */
  getViewExtent(): LngLat[] | null {
    return this.#viewExtent ? this.#viewExtent.map(p => ({ ...p })) : null;
  }

  /** 地図の範囲（枠線・塗り）を描く。空配列で消す。地図を切り替えると今の地図の座標で描き直す。 */
  setEnvelopes(items: EnvelopeSpec[]): void {
    this.#envelopes = Array.isArray(items) ? items.map(item => ({ ...item })) : [];
    void this.#drawEnvelopes();
  }

  /** 既定のピンの画像（POI にも祖先にも icon が無いマーカーに地図が描く画像。Core の parts/defaultpin*.png）。 */
  getDefaultPinIcon(selected = false): string {
    return defaultPinIcon(selected);
  }

  /** 現在の地図の zoom を delta だけ変える。 */
  zoomBy(delta: number): void {
    const view = (this.requireImplementation("zoomBy") as any).mapObject?.getView?.();
    if (!view) return;
    const zoom = view.getZoom();
    if (typeof zoom !== "number") return;
    if (typeof view.animate === "function") view.animate({ zoom: zoom + delta, duration: 250 });
    else view.setZoom(zoom + delta);
  }

  /**
   * MaplatApp の生成（テスト用の差し替え口）。
   * @internal
   */
  protected createCore(option: Record<string, any>): CoreApp {
    return new MaplatApp(option);
  }

  // ---- 基底クラスの hook ----

  protected features(): Readonly<Record<string, boolean>> {
    return CORE_FEATURES;
  }

  /**
   * 互換モードでは、要素の機能系キーの getter が Core の実際の値（設定ファイルから読んだ値を含む）を返す。
   * 通常モードは undefined（基底の既定）を返し、今までどおり属性・起動時の値を返す（挙動を変えない）。
   * 旧クラス互換層の <maplat-ui> は this.#app?.northUp を読むので、地図とコンパスを食い違わせない。
   * Core 固有の読み口はここに置く（element_base.ts は Core-Pro と共有する土台なので、口だけを置く）。
   * 対象は <maplat-app> の属性・プロパティの表にある機能系キー（northUp・homeMarginPixels・noRotate）だけ。
   * tapDuration・tapUIVanish は <maplat-ui> の属性で、互換層が appData から移すのでここには無い。
   */
  protected implementationKeyValue(
    prop: string,
    impl: LayerAImplementation
  ): { value: unknown } | undefined {
    if (!this.#compat) return undefined;
    const app = impl as any;
    let value: unknown;
    switch (prop) {
      case "northUp":
        value = app.mapObject?.northUp;
        break;
      case "homeMarginPixels":
        value = app.mapObject?.homeMarginPixels;
        break;
      case "noRotate":
        value = app.noRotate;
        break;
      default:
        return undefined;
    }
    return value === undefined ? undefined : { value };
  }

  /** MaplatApp に渡す appOption を組む（個別のキー ＞ appOption ＞ 設定ファイル ＞ 既定値）。 */
  protected createImplementation(config: ElementStartupConfig): LayerAImplementation {
    const option: Record<string, any> = { ...config.appOption };
    for (const [prop, value] of Object.entries(config.values)) {
      const key = OPTION_KEY_BY_PROP.get(prop);
      if (key) option[key] = value;
    }
    option.div = config.element;
    // 旧クラス互換層（MaplatUi）は appOption.__maplatCompat = true を渡す。そのときだけ旧クラスと同じ
    // 読み方（設定ファイルの機能系キー・fakeGps/fakeRadius）へ戻す。
    // __maplatCompat は互換層だけが使う内部キーで公開面ではない。MaplatApp は知らないキーとして無視する。
    this.#compat = config.appOption?.__maplatCompat === true;
    // 要素の経路では設定ファイルの機能系キーを読まない（関連する修正も要素の経路だけ）
    option.__maplatElementMode = config.appOption?.__maplatCompat !== true;
    if (config.setting !== undefined) option.setting = config.setting;
    // map-id・transparency は restore より強い。restore を与えると localStorage を
    // 読まなくなるので、Core が復元値を決めた後に上書きする口（__restoreOverride）で渡す
    const override: Record<string, any> = {};
    if (config.values.mapId !== undefined) override.mapID = config.values.mapId;
    if (config.values.transparency !== undefined) override.transparency = config.values.transparency;
    if (Object.keys(override).length > 0) option.__restoreOverride = override;
    return this.createCore(option) as unknown as LayerAImplementation;
  }

  protected onImplementationCreated(_impl: LayerAImplementation): void {
    this.#viewExtent = null;
  }

  protected onImplementationReady(impl: LayerAImplementation): void {
    this.#hookMoveEvents(impl as unknown as CoreApp);
    if (this.#envelopes.length > 0) void this.#drawEnvelopes();
  }

  protected onImplementationDetached(_impl: LayerAImplementation): void {
    this.#unhookMove?.();
    this.#unhookMove = null;
    this.#viewExtent = null;
    this.#envelopeSeq++;
    this.#viewExtentSeq++;
  }

  protected onImplementationEvent(type: string, _detail: unknown, impl: LayerAImplementation): void {
    if (type === "changeViewpoint") void this.#updateViewExtent(impl);
    // 枠線は今の地図の座標で描くので、地図を切り替えたら描き直す（旧 UI の updateEnvelope と同じ契機）
    if (type === "mapChanged" && this.#envelopes.length > 0) void this.#drawEnvelopes();
  }

  protected onResize(impl: LayerAImplementation): void {
    // OL の Map も自分の target を ResizeObserver で見ているが、要素の箱の変化を確実に拾うため
    // 要素側でも updateSize を呼ぶ（二重に呼んでも害はない）。前面・背面の知識は Core が持つ
    (impl as unknown as ElementImplementationInternals).updateSize?.();
  }

  protected convertEventDetail(type: string, detail: any, impl: LayerAImplementation): unknown {
    if (type === "sourceLoaded" && Array.isArray(detail)) {
      // source の配列でなく { mapID, usable }[]。usable の判定は実装が持つ（詰め替えだけ）
      return (impl as unknown as ElementImplementationInternals).sourceLoadedDetail(detail);
    }
    return super.convertEventDetail(type, detail, impl);
  }

  protected applyRuntimeChanges(
    impl: LayerAImplementation,
    pending: ReadonlySet<string>,
    resolve: RuntimeValueResolver
  ): void {
    // 自分が知っているキーだけを集めて 1 回渡す。undefined は「与えられていない」として
    // Core が既定／設定ファイルの値を埋める（Core に appOption の控えは置かない）
    const values: Record<string, unknown> = {};
    for (const prop of [
      "northUp",
      "homeMarginPixels",
      "debug",
      "icon",
      "selectedIcon",
      "poiTemplate",
      "poiStyle",
      "iconTemplate"
    ] as const) {
      if (!pending.has(prop)) continue;
      const optionKey = OPTION_KEY_BY_PROP.get(prop);
      values[optionKey ?? prop] = resolve(prop, optionKey, undefined);
    }
    if (Object.keys(values).length > 0) {
      (impl as unknown as ElementImplementationInternals).applyRuntimeOptions(values);
    }
  }

  /** 中心の目印。既定で表示。no-center-marker で消し、center-marker-src で画像を差し替える。 */
  protected applyDomKeys(): void {
    // 表現は Core が当てる。作成前（実装が無い）は何もしない（今も img が無くて何もしないのと同じ）
    const impl = this.currentImplementation();
    if (!impl) return;
    (impl as unknown as ElementImplementationInternals).setCenterMarker({
      hidden: this.readKey("noCenterMarker") === true,
      src: (this.readKey("centerMarkerSrc") as string | undefined) ?? null
    });
  }

  // ---- 内部 ----

  /**
   * 画面の 4 隅を今の地図の座標 → merc → 経緯度にして控える。
   * 4 隅の作り方・大きさの点検・undefined（据え置き）/null（消す）の意味づけはここに残す。
   */
  async #updateViewExtent(impl: LayerAImplementation) {
    const seq = ++this.#viewExtentSeq;
    const internals = impl as unknown as ElementImplementationInternals;
    const size = internals.viewportSize();
    if (!size) return;
    const pixels: [number, number][] = [
      [0, 0],
      [size[0], 0],
      [size[0], size[1]],
      [0, size[1]]
    ];
    try {
      const mercs = await Promise.all(pixels.map(px => internals.pixelToMerc(px)));
      if (seq !== this.#viewExtentSeq) return;
      // 前提（地図・from・pixel → 座標）が無い = undefined は、今の控えを変えない
      if (mercs.some(merc => merc === undefined)) return;
      if (!mercs.every(isFiniteXY)) {
        this.#viewExtent = null;
        return;
      }
      this.#viewExtent = (mercs as [number, number][]).map(merc => {
        const [longitude, latitude] = mercToLngLat(merc);
        return { longitude, latitude };
      });
    } catch (_e) {
      if (seq === this.#viewExtentSeq) this.#viewExtent = null;
    }
  }

  /** setEnvelopes の指定を今の地図に描く（旧 UI の updateEnvelope と同じ規則）。 */
  async #drawEnvelopes() {
    const seq = ++this.#envelopeSeq;
    const app = this.currentImplementation() as any;
    if (!app || !this.isImplementationReady()) return; // ready 後に onImplementationReady で描く
    const map = app.mapObject;
    const from = app.from;
    if (!map || !from) return;
    const specs = this.#envelopes;
    const drawn = await Promise.all(
      specs.map(async spec => {
        const source = app.cacheHash?.[spec.mapID];
        if (!source) return null;
        try {
          let xys: unknown[];
          if (spec.mapID === from.mapID && typeof source.xy2SysCoord === "function" && source.width && source.height) {
            // 現在の古地図は画像の 4 隅
            xys = [
              [0, 0],
              [source.width, 0],
              [source.width, source.height],
              [0, source.height],
              [0, 0]
            ].map(xy => source.xy2SysCoord(xy));
          } else {
            const ring = source.envelope?.geometry?.coordinates?.[0];
            if (!Array.isArray(ring)) return null;
            xys = await Promise.all(ring.map((merc: number[]) => from.merc2SysCoordAsync(merc)));
          }
          if (!xys.every(isFiniteXY)) return null;
          return { spec, xys };
        } catch (_e) {
          return null;
        }
      })
    );
    if (seq !== this.#envelopeSeq || this.currentImplementation() !== app) return;
    map.resetEnvelope();
    for (const item of drawn) {
      if (!item) continue;
      const { spec, xys } = item;
      if (spec.stroke) {
        map.setEnvelope(xys, {
          color: spec.stroke.color,
          width: spec.stroke.width ?? 2,
          ...(spec.stroke.lineDash ? { lineDash: spec.stroke.lineDash } : {})
        });
      }
      if (spec.fill) map.setFillEnvelope(xys, null, { color: spec.fill });
    }
  }

  /** moveStart / moveEnd（止まって 150 ms 後に moveEnd）。 */
  #hookMoveEvents(app: CoreApp) {
    const map = (app as any).mapObject;
    if (!map?.on) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let moving = false;
    const onStart = () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      if (moving) return;
      moving = true;
      this.dispatchLayerAEvent("moveStart", {});
    };
    const onEnd = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        if (!moving) return;
        moving = false;
        this.dispatchLayerAEvent("moveEnd", this.viewpoint);
      }, 150);
    };
    map.on("movestart", onStart);
    map.on("moveend", onEnd);
    this.#unhookMove = () => {
      if (timer) clearTimeout(timer);
      map.un?.("movestart", onStart);
      map.un?.("moveend", onEnd);
    };
  }
}

// プロパティ名 → MaplatApp の appOption のキー
const OPTION_KEY_BY_PROP = new Map<string, string>(
  [...ATTRS, ...PROPS].filter(d => d.option).map(d => [d.prop, d.option as string])
);

/** <maplat-app> を登録する（二重登録は何もしない。別実装が登録済みなら警告して上書きしない）。 */
export function defineMaplatAppElement(tagName: string = MAPLAT_APP_TAG) {
  defineMaplatAppElementOnce(MaplatAppElement, tagName, "@maplat/core/element");
}

defineMaplatAppElement();

declare global {
  interface HTMLElementTagNameMap {
    "maplat-app": MaplatAppElement;
  }
}
