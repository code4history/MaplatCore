// 模擬の層 A（地図を描かない <maplat-app>）。@maplat/core/conformance から公開する。
//
// 用途:
//   - 層 B（<maplat-ui>・UI-Pro）を、層 A の**公開面だけ**の上で動かす（B-公開面だけ・B-出し分け）
//   - 層 A の適合テスト群（./layer-a.ts）が公開面を正しく測れていることの確認（模擬にも同じ群を流す）
//
// 公開面以外を持たない: 中身の表示は closed の Shadow DOM に置く（`shadowRoot` は null のまま・
// 層 B が子の DOM を querySelector しても何も無い）。中身の地図は持たず、地図の一覧・視点・状態を
// メモリ上で真似る。試験からイベントを起こすときは getMockLayerAController(el) を使う（要素には足さない）。
//
// 依存は element_base・element_contract だけ（OpenLayers 等を引き込まない）。
import {
  MaplatAppElementBase,
  defineMaplatAppElementOnce,
  type ElementStartupConfig,
  type LayerAImplementation,
  type RuntimeValueResolver
} from "../element_base";
import {
  LAYER_A_PRO_EVENTS,
  LIFECYCLE_PHASES,
  MAPLAT_APP_EVENTS,
  MAPLAT_APP_TAG,
  featuresOf,
  type DisplayMode,
  type EnvelopeSpec,
  type LngLat,
  type MapListItem,
  type MapMeta,
  type MaplatPoi,
  type PoiLayer,
  type Restore,
  type TileCacheProgress,
  type TileCacheProgressType,
  type TileCacheStats,
  type Viewpoint
} from "../element_contract";

/** 模擬の設定ファイルの sources の 1 件（文字列なら mapID だけのベースマップ）。 */
export interface MockSource {
  mapID: string;
  label?: string | Record<string, string>;
  thumbnail?: string | null;
  isBasemap?: boolean;
  isOldMap?: boolean;
  isOverlay?: boolean;
  /** 地図の範囲（経緯度の多角形） */
  envelope?: [number, number][];
  cacheEnable?: boolean;
  /**
   * タイルキャッシュの全タイル数（本物の Weiwudi のインスタンスが持つ totalTile に当たる）。
   * 模擬はキャッシュを持たないので、getMapTileCacheStatsAsync はここを total として返す。
   * 数が無ければ本物で total が分からないときと同じく total を載せない。
   */
  tileCacheTotal?: number;
  /** false なら読込で落ちた source（sourceLoaded で usable: false・listMaps に載らない） */
  usable?: boolean;
  /** 地図のホーム（経緯度）と zoom */
  homePosition?: [number, number];
  defaultZoom?: number;
  /** getMapMeta に載せる項目 */
  meta?: Partial<MapMeta>;
}

export interface MockLayerAOptions {
  /** implementation の値（既定 "core"） */
  implementation?: string;
  /** version の値（既定 "0.0.0-mock"） */
  version?: string;
  /** supports() の答えの上書き（既定は implementation の機能表の列） */
  features?: Partial<Record<string, boolean>>;
}

const MERC_MAX = 20037508.342789244;
const lngLatToMerc = (lng: number, lat: number): [number, number] => [
  (lng * MERC_MAX) / 180,
  (Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) * (MERC_MAX / 180)
];
const mercToLngLat = (x: number, y: number): [number, number] => [
  (x / MERC_MAX) * 180,
  (180 / Math.PI) * (2 * Math.atan(Math.exp(((y / MERC_MAX) * 180 * Math.PI) / 180)) - Math.PI / 2)
];
// zoom z での 1 画素あたりの merc（256 px のタイル）
const resolutionAt = (zoom: number) => (2 * MERC_MAX) / (256 * Math.pow(2, zoom));

// 文字列で書いた source（実装の同梱ベースマップに当たる）のサムネイル。実装が同梱画像を持つのと同じく、
// ページの置き場に依らず読める画像（適合テストの A-互換が確かめる）
const MOCK_BUNDLED_THUMBNAIL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#cfd8e3"/></svg>'
)}`;

// 模擬の既定のピン（実装が地図に描く既定の画像に当たる。getDefaultPinIcon が返し、マーカーの当たり判定の大きさにも使う）
const MOCK_PIN_SIZE: [number, number] = [24, 36];
const mockPinUrl = (selected: boolean) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"><path d="M12 35C12 35 1 20 1 12A11 11 0 0 1 23 12C23 20 12 35 12 35Z" fill="${selected ? "#d32f2f" : "#2e7d32"}" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>`
  )}`;
export const MOCK_DEFAULT_PIN = mockPinUrl(false);
export const MOCK_DEFAULT_PIN_SELECTED = mockPinUrl(true);

/** 模擬の POI のレイヤー（Core の normalizeLayer の形。__nextId は id の連番）。 */
type MockPoiLayer = PoiLayer & { __nextId: number };

/** 線・面の種類と、clear の絞り込み（Core の VectorType・VectorFilter と同じ）。 */
type MockVectorType = "Line" | "Polygon";
interface MockVectorFilter {
  type?: MockVectorType;
}

/** 登録簿の 1 件（Core の VectorEntry から、描画に使う feature・drawToken を除いた形）。 */
interface MockVectorEntry {
  id: string;
  data: any; // 呼び手の data は変えず、写しを持つ
  kind: MockVectorType; // data.type が "Line" か未指定なら "Line"、それ以外は "Polygon"
}

/** POI の座標を lnglat にまとめる（Core の normalizePoi と同じ）。 */
function normalizePoi(raw: Record<string, any>): MaplatPoi {
  const poi = { ...raw } as Record<string, any>;
  if (!poi.lnglat) poi.lnglat = [poi.lng ?? poi.longitude, poi.lat ?? poi.latitude];
  delete poi.lng;
  delete poi.lat;
  delete poi.longitude;
  delete poi.latitude;
  return poi as MaplatPoi;
}

/** レイヤーの POI に id・namespaceID を振る（Core の addIdToPoi と同じ: id は `${キー}_${連番}`、アプリのレイヤーは名前空間なし）。 */
function addIds(layer: MockPoiLayer) {
  for (const poi of layer.pois) {
    if (!poi.id) poi.id = `${layer.id}_${layer.__nextId++}`;
    if (!poi.namespaceID) poi.namespaceID = `${poi.id}`;
  }
}

/** レイヤーの中身（旧仕様の POI 配列・{ pois, name, icon, ... }）を模擬のレイヤーへ（Core の normalizeLayer と同じ）。 */
function normalizeLayer(id: string, data: unknown, name: unknown): MockPoiLayer {
  const src: Record<string, any> = Array.isArray(data)
    ? { pois: data }
    : data && typeof data === "object"
      ? { ...(data as Record<string, any>) }
      : {};
  const pois = Array.isArray(src.pois) ? src.pois : [];
  const layer = {
    ...src,
    id,
    namespaceID: id,
    name: src.name ?? name,
    pois: pois.filter((p: unknown) => p && typeof p === "object").map((p: Record<string, any>) => normalizePoi(p)),
    __nextId: 0
  } as MockPoiLayer;
  addIds(layer);
  return layer;
}

function normalizeSource(raw: unknown): MockSource | null {
  if (typeof raw === "string") return { mapID: raw, label: raw, isBasemap: true, thumbnail: MOCK_BUNDLED_THUMBNAIL };
  if (raw && typeof raw === "object" && typeof (raw as MockSource).mapID === "string") return { ...(raw as MockSource) };
  return null;
}

/** 模擬の中身（旧クラス MaplatApp と同じ形の 46 メソッドとイベントを持つ）。 */
export class MockLayerAApp extends EventTarget implements LayerAImplementation {
  waitReady: Promise<void>;
  appid: string | undefined;
  appData: Record<string, any> | null = null;
  initialRestore: Restore = {};
  stateBuffer: Restore = {};
  restoreSession = false;
  sources: MockSource[] = [];
  displayMode: DisplayMode = "maplat";
  /** 要素の setEnvelopes で最後に指定された枠線（試験から読む） */
  envelopes: EnvelopeSpec[] = [];
  #element: HTMLElement;
  #current: MockSource | null = null;
  #center: [number, number] = [0, 0]; // merc
  #zoom = 2;
  #rotation = 0; // 度
  #direction = 0; // 度
  #transparency: number | undefined;
  #gps = false;
  #timer: ReturnType<typeof setTimeout> | undefined;
  #layers = new Map<string, MockPoiLayer>();
  #selected: string | undefined;
  /** addLine／addVector で登録した線・面の登録簿（Map の挿入順が一覧の順。置き換えは末尾へ移る）。 */
  #vectorStore = new Map<string, MockVectorEntry>();
  /** 自動の id の連番（clear では戻さない。Core の __vectorSeq と同じ）。 */
  #vectorSeq = 0;
  #removed = false;
  /** 視点の連続変化の始まり・止まり（要素が moveStart / moveEnd に変える） */
  onMove: ((kind: "start" | "end") => void) | null = null;

  constructor(config: ElementStartupConfig) {
    super();
    this.#element = config.element;
    const values = config.values;
    const option = config.appOption;
    this.appid = (values.appId as string | undefined) ?? option.appid;
    this.restoreSession = !!(values.restoreSession ?? option.restoreSession);
    const restore = (values.restore ?? option.restore) as Restore | undefined;
    if (restore) {
      this.initialRestore = { ...restore };
    } else if (this.restoreSession) {
      this.initialRestore = this.#readSession((values.restoreExtensionKeys ?? option.restoreExtensionKeys) as unknown);
    }
    if (values.mapId !== undefined) {
      if (values.mapId !== this.initialRestore.mapID) delete this.initialRestore.position;
      this.initialRestore.mapID = values.mapId as string;
    }
    if (values.transparency !== undefined) this.initialRestore.transparency = values.transparency as number;
    this.waitReady = this.#init(config);
  }

  // ---- 初期化 ----

  #readSession(extensionKeys: unknown): Restore {
    const out: Restore = {};
    try {
      const epoch = parseInt(localStorage.getItem("epoch") || "0", 10);
      const now = Math.floor(Date.now() / 1000);
      if (!epoch || now - epoch >= 3600) return out;
      // 本物の Core（src/index.ts の restoreSession）と同じ読み方にする:
      // ・mapID は sourceID、backgroundID は backID へも落とす
      // ・position は x・y が無くても 0 で載せる（メルカトル原点に当たる）
      // ・transparency は無ければ 0、hideMarker は parseInt で 0（どちらも常に載る）
      // ・hideLayer は文字列のまま（無ければ載せない）
      out.mapID = localStorage.getItem("mapID") || localStorage.getItem("sourceID") || undefined;
      out.backgroundID = localStorage.getItem("backgroundID") || localStorage.getItem("backID") || undefined;
      out.position = {
        x: parseFloat(localStorage.getItem("x") || "0"),
        y: parseFloat(localStorage.getItem("y") || "0"),
        zoom: parseFloat(localStorage.getItem("zoom") || "0"),
        rotation: parseFloat(localStorage.getItem("rotation") || "0")
      };
      out.transparency = parseFloat(localStorage.getItem("transparency") || "0");
      out.hideMarker = parseInt(localStorage.getItem("hideMarker") || "0", 10);
      out.hideLayer = localStorage.getItem("hideLayer") || undefined;
      // 層 B の拡張キーは既にあるキーを上書きしない（値は文字列のまま・無いキーは載せない）
      if (Array.isArray(extensionKeys)) {
        for (const key of extensionKeys) {
          if (typeof key !== "string" || key in out) continue;
          const value = localStorage.getItem(key);
          if (value !== null) out[key] = value;
        }
      }
    } catch (_e) {
      // localStorage が使えない環境では復元しない
    }
    return out;
  }

  async #phase(phaseId: (typeof LIFECYCLE_PHASES)[number], hooks: Record<string, any> | undefined) {
    const name = `on${phaseId
      .split("-")
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join("")}`;
    const context = { phaseId, appData: this.appData, mapDivDocument: this.#element, core: this.#element };
    try {
      if (typeof hooks?.[name] === "function") await hooks[name](context);
    } catch (error) {
      this.#emit("lifecycle:error", { phaseId, error });
    }
    // 旧クラスと同じく context の全部を detail に載せる（要素が phaseId・appData だけに削る）
    this.#emit(`lifecycle:${phaseId}`, context);
  }

  async #init(config: ElementStartupConfig): Promise<void> {
    const hooks = (config.values.uiHooks ?? config.appOption.uiHooks) as Record<string, any> | undefined;
    let setting = config.setting;
    if (setting === undefined && this.appid) {
      const res = await fetch(`apps/${this.appid}.json`);
      if (!res.ok) throw new Error(`mock <maplat-app>: failed to load apps/${this.appid}.json (${res.status})`);
      setting = await res.json();
    }
    this.appData = { ...((await setting) as Record<string, any>) };
    await this.#phase("setting-loaded", hooks);
    await this.#phase("appdata-ready", hooks);
    await this.#phase("ui-configure", hooks);
    await this.#phase("core-dom-ready", hooks);
    await this.#phase("ui-dom-ready", hooks);
    const raws: unknown[] = Array.isArray(this.appData.sources) ? this.appData.sources : [];
    const all = raws.map(normalizeSource);
    this.sources = all.filter((s): s is MockSource => !!s && s.usable !== false);
    this.#emit(
      "sourceLoaded",
      all.map(s => ({ mapID: s?.mapID ?? null, usable: !!s && s.usable !== false }))
    );
    // main（アプリの既定のレイヤー）。Core と同じく名前はアプリの appName、POI には id・namespaceID を振る
    const pois = Array.isArray(this.appData.pois) ? this.appData.pois : [];
    this.#layers.set("main", normalizeLayer("main", { pois, hide: false }, this.appData.appName ?? "main"));
    if (this.sources.length > 0) {
      const restore = this.initialRestore;
      const initial =
        (restore.mapID && this.#find(restore.mapID) ? restore.mapID : undefined) ??
        (this.appData.startFrom && this.#find(this.appData.startFrom) ? this.appData.startFrom : undefined) ??
        this.sources[this.sources.length - 1].mapID;
      await this.changeMap(initial, restore);
    }
    await this.#phase("core-ready", hooks);
    await this.#phase("ui-ready", hooks);
  }

  // ---- 道具 ----

  #emit(type: string, detail: unknown) {
    if (this.#removed) return;
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  #find(mapID: string | undefined) {
    return mapID ? this.sources.find(s => s.mapID === mapID) : undefined;
  }

  #viewpoint(): Viewpoint {
    const [longitude, latitude] = mercToLngLat(this.#center[0], this.#center[1]);
    return {
      x: this.#center[0],
      y: this.#center[1],
      longitude,
      latitude,
      mercator_x: this.#center[0],
      mercator_y: this.#center[1],
      zoom: this.#zoom,
      mercZoom: this.#zoom,
      direction: this.#direction,
      rotation: this.#rotation
    };
  }

  #moved() {
    this.onMove?.("start");
    this.#emit("changeViewpoint", this.#viewpoint());
    setTimeout(() => this.onMove?.("end"), 30);
  }

  /** 要素の矩形（大きさが無ければ null） */
  #rect(): DOMRect | null {
    const rect = this.#element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 ? rect : null;
  }

  pixelToLngLat(px: number, py: number): LngLat | null {
    const rect = this.#rect();
    if (!rect) return null;
    const res = resolutionAt(this.#zoom);
    const mx = this.#center[0] + (px - rect.width / 2) * res;
    const my = this.#center[1] - (py - rect.height / 2) * res;
    const [longitude, latitude] = mercToLngLat(mx, my);
    return { longitude, latitude };
  }

  // ---- 旧クラスと同じ 46 のメソッド ----

  handleGPS(enable: boolean, avoidEventForOff?: boolean) {
    this.#gps = !!enable;
    if (enable) this.#emit("gps_request", undefined);
    else if (!avoidEventForOff) this.#emit("gps_result", { error: "gps_off" });
  }
  getGPSEnabled() {
    return this.#gps;
  }
  getRotation() {
    return this.#rotation;
  }
  // 本物（Core・Pro）と同じく async（契約の型 Promise<number> に揃える）
  async getDirection(): Promise<number> {
    return this.#direction;
  }
  currentMapInfo() {
    return this.#current ? this.getMapMeta(this.#current.mapID) : undefined;
  }
  mapInfo(mapID: string) {
    return this.getMapMeta(mapID);
  }
  async clientPointToLngLat(clientX: number, clientY: number): Promise<LngLat | undefined> {
    const rect = this.#rect();
    if (!rect || !this.#current) return undefined;
    return this.pixelToLngLat(clientX - rect.left, clientY - rect.top) ?? undefined;
  }
  async lngLatToClientPoint(longitude: number, latitude: number): Promise<{ x: number; y: number } | undefined> {
    const rect = this.#rect();
    if (!rect || !this.#current) return undefined;
    const [mx, my] = lngLatToMerc(longitude, latitude);
    const res = resolutionAt(this.#zoom);
    return {
      x: rect.left + rect.width / 2 + (mx - this.#center[0]) / res,
      y: rect.top + rect.height / 2 - (my - this.#center[1]) / res
    };
  }
  selectMarker(id: string) {
    this.#selected = id;
  }
  unselectMarker() {
    this.#selected = undefined;
  }
  getMarker(id: string) {
    for (const layer of this.#layers.values()) {
      const poi = layer.pois.find(p => p.namespaceID === id || p.id === id);
      if (poi) return poi;
    }
    return undefined;
  }
  updateMarker(id: string, data: Record<string, unknown>, overwrite?: boolean) {
    const poi = this.getMarker(id);
    if (!poi) return undefined;
    if (overwrite) for (const k of Object.keys(poi)) if (k !== "id" && k !== "namespaceID") delete poi[k];
    Object.assign(poi, data);
    return id;
  }
  addMarker(data: Record<string, unknown>, layerId = "main") {
    const layer = this.#layers.get(layerId);
    if (!layer) return undefined;
    const poi = normalizePoi(data);
    layer.pois.push(poi);
    addIds(layer);
    this.#poiNumber();
    return poi.namespaceID;
  }
  removeMarker(id: string) {
    for (const layer of this.#layers.values()) {
      const i = layer.pois.findIndex(p => p.namespaceID === id || p.id === id);
      if (i >= 0) {
        layer.pois.splice(i, 1);
        this.#poiNumber();
        return;
      }
    }
  }
  clearMarker(layerId?: string) {
    for (const layer of this.#layers.values()) if (!layerId || layer.id === layerId) layer.pois = [];
    this.#poiNumber();
  }
  showAllMarkers() {
    this.requestUpdateState({ hideMarker: 0 });
  }
  hideAllMarkers() {
    this.requestUpdateState({ hideMarker: 1 });
  }
  listPoiLayers(hideOnly = false, nonzero = false): PoiLayer[] {
    // Core と同じ: main を先頭に定義順。nonzero は POI のあるもの、hideOnly は非表示のものだけ
    return [...this.#layers.values()].filter(layer =>
      nonzero ? layer.pois.length > 0 && (!hideOnly || !!layer.hide) : !hideOnly || !!layer.hide
    );
  }
  showPoiLayer(id: string) {
    const layer = this.#layers.get(id);
    if (layer) layer.hide = false;
    this.#hideLayerState();
  }
  hidePoiLayer(id: string) {
    const layer = this.#layers.get(id);
    if (layer) layer.hide = true;
    this.#hideLayerState();
  }
  getPoiLayer(id: string): PoiLayer | undefined {
    return this.#layers.get(id);
  }
  addPoiLayer(id: string, data?: unknown) {
    if (this.#layers.has(id) || id === "main") return;
    // Core と同じく、与えたレイヤーの値（name・icon・selectedIcon・hide 等）を保つ
    this.#layers.set(id, normalizeLayer(id, data, id));
  }
  removePoiLayer(id: string) {
    if (id !== "main") this.#layers.delete(id);
  }
  // nov26-m4-t5（#91）: 線を足して id を返す。data.id があればその id、無ければ自動の id。
  // 呼び手の data は変えず、写しに setLine と同じ正規化（type・stroke → style）をする（Core と同じ）。
  addLine(data: any): string {
    const d: any = { ...data, type: "Line" };
    if (!d.style && d.stroke) {
      d.style = {
        stroke: d.stroke
      };
    }
    delete d.id;
    return this.#addVectorEntry(data.id, d);
  }
  // 線・面を足して id を返す（data.type が "Line" または未指定なら線、それ以外は面）
  addVector(data: any): string {
    const d: any = { ...data };
    delete d.id;
    return this.#addVectorEntry(data.id, d);
  }
  // id の 1 件だけを消す。消したら true、無ければ false
  removeVector(id: string): boolean {
    return this.#vectorStore.delete(id);
  }
  // removeVector の別名（種類で絞らない）
  removeLine(id: string): boolean {
    return this.removeVector(id);
  }
  // 引数なしは線も面も全部消す。filter.type で線だけ・面だけを消す
  clearLine(filter?: MockVectorFilter) {
    this.clearVector(filter);
  }
  clearVector(filter?: MockVectorFilter) {
    const type = filter?.type;
    if (!type) {
      this.#vectorStore.clear();
      return;
    }
    for (const entry of Array.from(this.#vectorStore.values())) {
      if (entry.kind === type) this.#vectorStore.delete(entry.id);
    }
  }
  // addLine／addVector で登録した線・面の data（写し）の配列。読み取り専用（Core の getter と同じ）
  get vectors(): any[] {
    return Array.from(this.#vectorStore.values()).map(entry => entry.data);
  }
  /** 登録簿に 1 件足す（既にある id なら置き換え、末尾＝描画では最前面へ移る）。 */
  #addVectorEntry(givenId: unknown, data: any): string {
    let id: string;
    if (givenId !== undefined && givenId !== null) {
      id = String(givenId);
    } else {
      do {
        id = `vector_${++this.#vectorSeq}`;
      } while (this.#vectorStore.has(id));
    }
    // 既にある id なら置き換える（Map#delete → set で挿入順の末尾へ移る）
    this.#vectorStore.delete(id);
    this.#vectorStore.set(id, {
      id,
      data,
      kind: data.type === undefined || data.type === "Line" ? "Line" : "Polygon"
    });
    return id;
  }
  setGPSMarker(_position: unknown) {
    // 模擬は GPS のマーカーを描かない
  }
  changeMap(mapID: string, restore: Restore = {}): Promise<void> {
    const to = this.#find(mapID);
    if (!to) return Promise.resolve();
    const first = !this.#current;
    this.#current = to;
    const home = to.homePosition ?? (this.appData?.homePosition as [number, number] | undefined) ?? [139.7, 35.7];
    if (first) {
      this.#center = lngLatToMerc(home[0], home[1]);
      this.#zoom = to.defaultZoom ?? this.appData?.defaultZoom ?? 14;
    }
    if (restore.position && typeof restore.position.x === "number" && typeof restore.position.y === "number") {
      this.#center = [restore.position.x, restore.position.y];
      if (typeof restore.position.zoom === "number" && restore.position.zoom > 0) this.#zoom = restore.position.zoom;
    }
    this.requestUpdateState({ mapID: to.mapID });
    this.#emit("mapChanged", this.getMapMeta(to.mapID));
    // 透過度は地図を切り替えても保つ（restore の 0 も有効）
    this.setTransparency(restore.transparency ?? this.getTransparency());
    // 本物の Core と同じく、restore の hideLayer（カンマ区切りのレイヤー ID）を当てる
    if (restore.hideLayer) {
      for (const key of restore.hideLayer.split(",")) {
        const layer = this.#layers.get(key);
        if (layer) layer.hide = true;
      }
      this.#hideLayerState();
    }
    if (restore.hideMarker) this.hideAllMarkers();
    this.#poiNumber();
    this.#moved();
    return Promise.resolve();
  }
  requestUpdateState(data: Partial<Restore>) {
    this.stateBuffer = Object.assign(this.stateBuffer, data);
    if (this.restoreSession) {
      try {
        localStorage.setItem("epoch", `${Math.floor(Date.now() / 1000)}`);
        for (const [key, value] of Object.entries(data)) {
          if (key === "position" && value && typeof value === "object") {
            for (const [k, v] of Object.entries(value)) localStorage.setItem(k, String(v));
          } else {
            localStorage.setItem(key, String(value));
          }
        }
      } catch (_e) {
        // 保存できない環境では保存しない
      }
    }
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.#timer = undefined;
      this.#emit("updateState", { ...this.stateBuffer });
    }, 50);
  }
  setTransparency(percentage: number) {
    this.#transparency = percentage;
    this.requestUpdateState({ transparency: percentage });
  }
  getTransparency() {
    return this.#transparency ?? 0;
  }
  setViewpoint(cond: { longitude?: number; latitude?: number; zoom?: number; mercZoom?: number; rotation?: number; direction?: number }) {
    if (typeof cond.longitude === "number" && typeof cond.latitude === "number") {
      this.#center = lngLatToMerc(cond.longitude, cond.latitude);
    }
    const zoom = cond.mercZoom ?? cond.zoom;
    if (typeof zoom === "number") this.#zoom = zoom;
    if (typeof cond.rotation === "number") this.#rotation = cond.rotation;
    if (typeof cond.direction === "number") this.#direction = cond.direction;
    this.#moved();
  }
  goHome() {
    const home = this.#current?.homePosition ?? (this.appData?.homePosition as [number, number] | undefined);
    if (home) this.#center = lngLatToMerc(home[0], home[1]);
    this.#zoom = this.#current?.defaultZoom ?? this.appData?.defaultZoom ?? this.#zoom;
    this.#moved();
  }
  resetRotation() {
    this.#rotation = 0;
    this.#moved();
  }
  resetDirection() {
    this.#direction = 0;
    this.#moved();
  }
  resetCirculation() {
    this.#rotation = 0;
    this.#direction = 0;
    this.#moved();
  }
  getMapMeta(mapID?: string): MapMeta | undefined {
    const source = mapID ? this.#find(mapID) : this.#current;
    if (!source) return undefined;
    return { ...(source.meta || {}), mapID: source.mapID, label: source.label ?? source.mapID };
  }
  getMapCacheEnable(mapID?: string) {
    const source = mapID ? this.#find(mapID) : this.#current;
    return !!source?.cacheEnable;
  }
  async getMapTileCacheStatsAsync(mapID?: string): Promise<TileCacheStats> {
    // 本物の Core と同じく、キャッシュを持たない地図は {}（source.getTileCacheStatsAsync が {} を返す）
    if (!this.getMapCacheEnable(mapID)) return {};
    const source = mapID ? this.#find(mapID) : this.#current;
    // 本物の Core は Weiwudi の stats に total が無ければインスタンスの totalTile で補う。
    // 模擬は Weiwudi を持たないので、設定の tileCacheTotal を total として返す。数が無ければ
    // 本物で total が分からないとき（total を載せない）と同じ形にする。
    const total = source?.tileCacheTotal;
    return typeof total === "number" ? { size: 0, count: 0, total } : { size: 0, count: 0 };
  }
  async getMapTileCacheSizeAsync(mapID?: string) {
    return (await this.getMapTileCacheStatsAsync(mapID)).size || 0;
  }
  async clearMapTileCacheAsync(_mapID?: string) {
    // 模擬はキャッシュを持たない
  }
  async fetchAllMapTileCacheAsync(
    mapID: string | undefined,
    callback: (type: TileCacheProgressType, detail: TileCacheProgress) => void
  ) {
    if (!this.getMapCacheEnable(mapID)) {
      callback("stop", {});
      return;
    }
    callback("proceed", { processed: 0, total: 0 });
    callback("finish", { processed: 0, total: 0, size: 0, count: 0 });
  }
  async cancelMapTileCacheAsync(_mapID?: string) {
    // 模擬はキャッシュを持たない
  }

  // ---- 要素から呼ぶもの ----

  /**
   * 要素の上のクリック（タップ）。マーカー（既定のピンの大きさ・下端の中央が POI の位置）に当たれば
   * clickMarker と、その直後に同期で clickMarkers（重なる全部。1 件でも出す）を出す。当たらなければ clickMap*。
   */
  tapAt(clientX: number, clientY: number) {
    const rect = this.#rect();
    if (!rect || !this.#current || this.#removed) return;
    const res = resolutionAt(this.#zoom);
    const hidden = !!this.stateBuffer.hideMarker;
    const hits: MaplatPoi[] = [];
    if (!hidden) {
      for (const layer of this.#layers.values()) {
        if (layer.hide) continue;
        for (const poi of layer.pois) {
          const ll = poi.lnglat;
          if (!Array.isArray(ll) || !Number.isFinite(ll[0]) || !Number.isFinite(ll[1])) continue;
          const [mx, my] = lngLatToMerc(ll[0], ll[1]);
          const px = rect.left + rect.width / 2 + (mx - this.#center[0]) / res;
          const py = rect.top + rect.height / 2 - (my - this.#center[1]) / res;
          const dx = clientX - px;
          const dy = clientY - py;
          if (Math.abs(dx) <= MOCK_PIN_SIZE[0] / 2 && dy <= 0 && dy >= -MOCK_PIN_SIZE[1]) hits.push(poi);
        }
      }
    }
    if (hits.length > 0) {
      this.#emit("clickMarker", hits[0]);
      this.#emit("clickMarkers", hits);
      return;
    }
    const mx = this.#center[0] + (clientX - rect.left - rect.width / 2) * res;
    const my = this.#center[1] - (clientY - rect.top - rect.height / 2) * res;
    this.#emit("clickMapXy", [mx, my]);
    this.#emit("clickMapMerc", [mx, my]);
    const [longitude, latitude] = mercToLngLat(mx, my);
    this.#emit("clickMap", { longitude, latitude });
  }

  zoomBy(delta: number) {
    this.#zoom += delta;
    this.#moved();
  }

  viewExtent(): LngLat[] | null {
    const rect = this.#rect();
    if (!rect || !this.#current) return null;
    const corners: [number, number][] = [
      [0, 0],
      [rect.width, 0],
      [rect.width, rect.height],
      [0, rect.height]
    ];
    const out = corners.map(([x, y]) => this.pixelToLngLat(x, y));
    return out.every(Boolean) ? (out as LngLat[]) : null;
  }

  remove() {
    this.#removed = true;
    if (this.#timer) clearTimeout(this.#timer);
  }

  // ---- 試験から読む・起こすもの（getMockLayerAController 経由）----

  /** 選択中のマーカー（selectMarker の引数）。 */
  get selectedMarker(): string | undefined {
    return this.#selected;
  }

  /** 中身からイベントを出す（例: outOfMap・clickMarkers・gps_result・gps_error）。 */
  fire(type: string, detail?: unknown) {
    this.#emit(type, detail);
  }

  /** GPS の状態を中身の都合で変える（handleGPS(false, true) 相当の内部の切替）。 */
  setGpsEnabledInternally(enabled: boolean) {
    this.#gps = enabled;
    this.#emit("gps_result", enabled ? { lnglat: [0, 0], acc: 10 } : { error: "gps_out_hide" });
  }

  #poiNumber() {
    let n = 0;
    for (const layer of this.#layers.values()) if (!layer.hide) n += layer.pois.length;
    this.#emit("poi_number", n);
  }

  #hideLayerState() {
    const hidden = [...this.#layers.values()].filter(l => l.hide).map(l => l.id);
    this.requestUpdateState({ hideLayer: hidden.join(",") });
  }
}

const CONTROLLERS = new WeakMap<HTMLElement, () => MockLayerAApp | null>();

/** 模擬の要素の中身を試験から操る口（要素の公開面には足さない）。作る前・破棄の後は null。 */
export function getMockLayerAController(el: HTMLElement): MockLayerAApp | null {
  return CONTROLLERS.get(el)?.() ?? null;
}

/**
 * 模擬の <maplat-app> のクラスを作る。features で supports() の答えを切り替えられる
 * （display-mode を真にすると setDisplayMode / getDisplayMode / modechange・display-mode 属性が付く）。
 */
export function createMockMaplatAppClass(options: MockLayerAOptions = {}): CustomElementConstructor {
  const implementation = options.implementation ?? "core";
  const version = options.version ?? "0.0.0-mock";
  const features: Readonly<Record<string, boolean>> = Object.freeze({
    ...featuresOf(implementation),
    ...(Object.fromEntries(
      Object.entries(options.features ?? {}).filter(([, v]) => typeof v === "boolean")
    ) as Record<string, boolean>)
  });
  const displayMode = features["display-mode"] === true;

  class MockMaplatAppElement extends MaplatAppElementBase {
    readonly implementation = implementation;
    readonly version = version;
    #envelopes: EnvelopeSpec[] = [];
    #view: HTMLElement | null = null;
    #moveTimer: ReturnType<typeof setTimeout> | undefined;
    #moving = false;
    #down: { pointerId: number; x: number; y: number; t: number } | null = null;

    constructor() {
      super();
      // クリック（タップ）: 押して 9px 未満・250 ms 以内に離したら、中身に当たり判定をさせる（本物の地図と同じ受け方）
      this.addEventListener("pointerdown", e => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        this.#down = { pointerId: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp };
      });
      this.addEventListener("pointerup", e => {
        const down = this.#down;
        this.#down = null;
        if (!down || down.pointerId !== e.pointerId) return;
        if (Math.hypot(e.clientX - down.x, e.clientY - down.y) >= 9 || e.timeStamp - down.t > 250) return;
        const app = this.currentImplementation() as MockLayerAApp | null;
        if (app && this.isImplementationReady()) app.tapAt(e.clientX, e.clientY);
      });
      // 中身の表示は closed の Shadow DOM に隠す（shadowRoot は null のまま）
      if (typeof this.attachShadow === "function") {
        const root = this.attachShadow({ mode: "closed" });
        const view = document.createElement("div");
        view.style.cssText = "font:12px system-ui;color:#555;padding:4px;";
        view.textContent = "maplat-app (mock)";
        root.appendChild(view);
        this.#view = view;
      }
      CONTROLLERS.set(this, () => this.currentImplementation() as MockLayerAApp | null);
    }

    protected features() {
      return features;
    }

    protected forwardedEvents(): readonly string[] {
      return displayMode ? [...MAPLAT_APP_EVENTS, ...LAYER_A_PRO_EVENTS.map(e => e.event)] : MAPLAT_APP_EVENTS;
    }

    protected createImplementation(config: ElementStartupConfig): LayerAImplementation {
      const app = new MockLayerAApp(config);
      app.envelopes = this.#envelopes;
      if (displayMode && typeof config.values.displayMode === "string") {
        app.displayMode = config.values.displayMode as DisplayMode;
      }
      app.onMove = kind => {
        if (kind === "start") {
          if (this.#moveTimer) clearTimeout(this.#moveTimer);
          if (!this.#moving) {
            this.#moving = true;
            this.dispatchLayerAEvent("moveStart", {});
          }
          return;
        }
        if (this.#moveTimer) clearTimeout(this.#moveTimer);
        this.#moveTimer = setTimeout(() => {
          this.#moveTimer = undefined;
          if (!this.#moving) return;
          this.#moving = false;
          this.dispatchLayerAEvent("moveEnd", this.viewpoint);
        }, 150);
      };
      return app;
    }

    protected onImplementationEvent(type: string, detail: unknown): void {
      if (type === "mapChanged" && this.#view) {
        this.#view.textContent = `maplat-app (mock): ${(detail as MapMeta | undefined)?.mapID ?? "-"}`;
      }
    }

    protected onImplementationDetached(_impl: LayerAImplementation): void {
      if (this.#moveTimer) clearTimeout(this.#moveTimer);
      this.#moving = false;
    }

    protected applyRuntimeChanges(
      impl: LayerAImplementation,
      pending: ReadonlySet<string>,
      resolve: RuntimeValueResolver
    ): void {
      if (displayMode && pending.has("displayMode")) {
        const mode = resolve("displayMode", undefined, "maplat") as DisplayMode;
        if (mode !== (impl as MockLayerAApp).displayMode) {
          (impl as MockLayerAApp).displayMode = mode;
          (impl as MockLayerAApp).fire("modechange", { mode });
        }
      }
    }

    listMaps(): MapListItem[] {
      const app = this.currentImplementation() as MockLayerAApp | null;
      if (!app) return [];
      return app.sources.map(s => ({
        mapID: s.mapID,
        label: s.label ?? s.mapID,
        thumbnail: s.thumbnail ?? null,
        isBasemap: !!s.isBasemap,
        isOldMap: !!s.isOldMap,
        isOverlay: !!s.isOverlay,
        hasEnvelope: Array.isArray(s.envelope) && s.envelope.length >= 3,
        cacheEnable: !!s.cacheEnable
      }));
    }

    setEnvelopes(items: EnvelopeSpec[]): void {
      this.#envelopes = Array.isArray(items) ? items.map(i => ({ ...i })) : [];
      const app = this.currentImplementation() as MockLayerAApp | null;
      if (app) app.envelopes = this.#envelopes;
    }

    getMapEnvelope(mapID: string): LngLat[] | null {
      const app = this.currentImplementation() as MockLayerAApp | null;
      const source = app?.sources.find(s => s.mapID === mapID);
      if (!source || !Array.isArray(source.envelope) || source.envelope.length < 3) return null;
      return source.envelope.map(([longitude, latitude]) => ({ longitude, latitude }));
    }

    getViewExtent(): LngLat[] | null {
      const app = this.currentImplementation() as MockLayerAApp | null;
      return app && this.isImplementationReady() ? app.viewExtent() : null;
    }

    zoomBy(delta: number): void {
      (this.requireImplementation("zoomBy") as MockLayerAApp).zoomBy(delta);
    }

    getDefaultPinIcon(selected = false): string {
      return selected ? MOCK_DEFAULT_PIN_SELECTED : MOCK_DEFAULT_PIN;
    }
  }

  if (displayMode) {
    // Pro 固有のメソッドは supports("display-mode") が真のときだけ定義する
    Object.defineProperties(MockMaplatAppElement.prototype, {
      setDisplayMode: {
        configurable: true,
        writable: true,
        value(this: MockMaplatAppElement, mode: DisplayMode) {
          // 切り替えた表示モードは modechange を受けた基底が display-mode 属性へ書き戻す
          const app = getMockLayerAController(this);
          if (!app) {
            throw new DOMException("<maplat-app>.setDisplayMode(): the map is not created yet.", "InvalidStateError");
          }
          if (app.displayMode !== mode) {
            app.displayMode = mode;
            app.fire("modechange", { mode });
          }
          return Promise.resolve();
        }
      },
      getDisplayMode: {
        configurable: true,
        writable: true,
        value(this: MockMaplatAppElement): DisplayMode | null {
          const app = getMockLayerAController(this);
          return app ? app.displayMode : null;
        }
      }
    });
  }
  return MockMaplatAppElement;
}

/** 模擬の <maplat-app> を登録する（既に登録済みなら警告して上書きしない）。登録したクラスを返す。 */
export function defineMockMaplatApp(
  tagName: string = MAPLAT_APP_TAG,
  options: MockLayerAOptions = {}
): CustomElementConstructor {
  const existing = typeof customElements !== "undefined" ? customElements.get(tagName) : undefined;
  if (existing) {
    defineMaplatAppElementOnce(existing, tagName, "the mock layer A");
    return existing;
  }
  const ctor = createMockMaplatAppClass(options);
  defineMaplatAppElementOnce(ctor, tagName, "the mock layer A");
  return ctor;
}
