import { MaplatPoi } from './element_contract';
/**
 * 1.2 までの旧い記法（<% %>・${ }）で書かれたテンプレートかどうか。
 * raw・verbatim の中を除いた文字列に <%…%> または ${…} があれば旧い記法とみなす。
 * @internal
 */
export declare function isLegacyTemplate(src: string): boolean;
/**
 * 「1 回だけ」の警告の記憶を戻す（テストの間の初期化用）。
 * 公開面ではない（@maplat/core の入口からは出さない）。
 * @internal
 */
export declare function resetTemplateWarnings(): void;
/**
 * テンプレートを持ちうる段（POI のレイヤー・地図・アプリ）。評価が読むのは下の 5 つのキーだけで、
 * ほかのキーは見ない。値は設定ファイル由来で型を保証しないので unknown とし、偽の値は「無い」とみなす
 * （既存の型 PoiLayer は段の一つでしかなく、地図・アプリの段を表せないため、読むキーだけの型を置く）。
 * 索引の型を持つので、クラスのインスタンスを渡すときは `as PoiTemplateLevel` などで受け渡す。
 */
export interface PoiTemplateLevel {
    /** POI の吹き出しの HTML を作る Nunjucks のテンプレート */
    poiTemplate?: unknown;
    /** poiTemplate と一緒に補う CSS */
    poiStyle?: unknown;
    /** `{"icon": …, "selectedIcon": …}` の JSON を作る Nunjucks のテンプレート */
    iconTemplate?: unknown;
    /** iconTemplate が無い・使えないときに使うマーカーの画像 */
    icon?: unknown;
    selectedIcon?: unknown;
    [key: string]: unknown;
}
/** 評価が POI に補うキー（MaplatPoi の同名のキー） */
export type PoiTemplateFields = Pick<MaplatPoi, "icon" | "selectedIcon" | "html" | "poiStyle">;
/**
 * POI の複製に、祖先の iconTemplate・icon から icon・selectedIcon を補って返す。
 * 祖先は近い段から順に見て、最初に使える段の値を使う（iconTemplate が評価できない段は、同じ段の icon・
 * selectedIcon を使い、それも無ければ次の段へ）。POI 自身に icon があれば何も補わない。渡した data は書き換えない。
 * POI に 0.x の旧いキー名（snake_case）（`selected_icon`・`namespace_id` など）があると例外を投げる（normalizeArg）。
 * @param data POI（MaplatPoi の形。テンプレートが読む独自のキーもそのまま載る）
 * @param ancestors 近い段から順に、POI のレイヤー → 地図 → アプリ
 */
export declare function createIconSet<T extends object>(data: T, ...ancestors: PoiTemplateLevel[]): T & PoiTemplateFields;
/**
 * 祖先の poiTemplate から html を作り、同じ段の poiStyle（POI 自身に無ければ）と一緒に data に書き込んで返す。
 * 祖先は近い段から順に見て、最初に評価できた段を使う（評価できない段は poiStyle も使わず次の段へ）。
 * POI 自身に html があれば何もしない。**渡した data そのものを書き換えて返す**（複製しない）。
 * POI に 0.x の旧いキー名（snake_case）（`selected_icon`・`namespace_id` など）があると例外を投げる（normalizeArg）。
 * @param data POI（MaplatPoi の形）
 * @param ancestors 近い段から順に、POI のレイヤー → 地図 → アプリ
 */
export declare function createHtmlFromTemplate<T extends object>(data: T, ...ancestors: PoiTemplateLevel[]): T & PoiTemplateFields;
/**
 * POI の複製に、祖先のテンプレートから icon・selectedIcon と html・poiStyle を補う
 * （createIconSet で複製してから createHtmlFromTemplate を当てる）。
 * マーカーの描画（clickMarker の detail）と getMarker の戻り値が同じ形になるよう、両方がこの 1 つを通る。
 * 渡した data は書き換えない。POI に 0.x の旧いキー名（snake_case）があると例外を投げる（normalizeArg）。
 * @param data POI（MaplatPoi の形）
 * @param ancestors 近い段から順に、POI のレイヤー → 地図 → アプリ
 */
export declare function applyPoiTemplates<T extends object>(data: T, ...ancestors: PoiTemplateLevel[]): T & PoiTemplateFields;
