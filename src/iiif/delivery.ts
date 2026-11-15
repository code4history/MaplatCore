// IIIF の共通の配信を HistMap に結び、使えない地図を控える。
import { transPng } from "../const_ex";
import {
  prepareIiifDelivery,
  type IiifDeliveryReason,
  type IiifDeliveryError,
  type ResolvedIiifDelivery
} from "./image";
// ソースの道を読む既存の利用者にも同じ名前を残す。
export * from "./image";

/** 使えない IIIF の地図の印（起動を止めないため、source の代わりに配列に残す） */
export type UnusableSource = {
  mapID: string;
  __maplatUnusable: { reason: IiifDeliveryReason };
};

/**
 * 解決に失敗した IIIF の地図に付ける印を作る（起動全体を止めない）
 */
export function unusableSource(
  option: { mapID?: string } | string,
  err: IiifDeliveryError
): UnusableSource {
  // sources の要素は文字列（地図 ID だけ）のこともある（"gsi"・"osm" 等）
  const mapID = typeof option === "string" ? option : (option?.mapID ?? "");
  return {
    mapID,
    __maplatUnusable: { reason: err.reason }
  };
}

/**
 * 使えない IIIF の地図の印かどうか
 */
export function isUnusableSource(source: unknown): source is UnusableSource {
  return (
    !!source &&
    typeof source === "object" &&
    "__maplatUnusable" in (source as Record<string, unknown>)
  );
}

/** 起動のときに使えなかった IIIF の地図（要素の sourceLoaded の材料） */
export type UnusableSourceEntry = { mapID: string; reason: IiifDeliveryReason };

// 控えはアプリのインスタンスを鍵にした WeakMap に置く。アプリのクラスのフィールドに
// すると build の型（index.d.ts）に内部の面が出てしまう（利用者に見せる形を増やさない）。
// インスタンスが消えれば控えも一緒に消える。
const unusableSourcesByApp = new WeakMap<object, UnusableSourceEntry[]>();

/** 起動のときに使えなかった地図の控えを書く（起動のたびに作り直す） */
export function setUnusableSources(
  app: object,
  list: UnusableSourceEntry[]
): void {
  unusableSourcesByApp.set(app, [...list]);
}

/** 起動のときに使えなかった地図の控えを読む（無ければ空） */
export function getUnusableSources(app: object): UnusableSourceEntry[] {
  return [...(unusableSourcesByApp.get(app) ?? [])];
}

/** 紙の外を HistMap の透明なタイルに変える */
export function histMapTileUrlFunction(
  resolved: ResolvedIiifDelivery
): (coord: number[]) => string {
  return coord => resolved.tileUrl(coord[0], coord[1], coord[2]) ?? transPng;
}

/** 共通の配信を解決し、HistMap の構築と再設定に必要な値を入れる */
export async function prepareIiifOptions(
  options: any,
  expected: { width: number; height: number },
  opts?: { signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<void> {
  const delivery = await prepareIiifDelivery(options, expected, opts);
  options.tileUrlFunction = histMapTileUrlFunction(delivery);
  options.__maplatIiifUrl = delivery.url;
}

/**
 * source を作った直後に、IIIF の URL の関数を付け直す。
 *
 * OpenLayers の UrlTile は、url（または urls）を与えると構築の時点で URL の関数を
 * テンプレートから作り直す（generateTileUrlFunction_）。Maplat の HistMap は mapID が
 * あると `tiles/<mapID>/…` の url を補うので、options に入れただけでは IIIF の URL に
 * ならない。source の公開の口（setTileUrlFunction）で、作った後に付け直す。
 * key に配信の URL を渡して、タイルのキャッシュの鍵も配信ごとに分ける。
 */
export function applyIiifTileUrlFunction(source: any, options: any): void {
  if (!options || !options.__maplatIiifUrl) return;
  if (typeof source?.setTileUrlFunction !== "function") return;
  source.setTileUrlFunction(options.tileUrlFunction, options.__maplatIiifUrl);
}
