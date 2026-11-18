// 表示中の現代の地図の出典の表示（src/attribution.ts）の単体試験。
import { afterEach, describe, expect, it } from "vitest";
import OSM from "ol/source/OSM";
import StadiaMaps from "ol/source/StadiaMaps";
import TileJSON from "ol/source/TileJSON";
import XYZ from "ol/source/XYZ";
import {
  AttributionDisplay,
  attributionGroups,
  attributionTexts,
  closestLang,
  displayedAttributionSources,
  normalizeAttributionLang,
  GOOGLE_LOGO_MIN_WIDTH,
  GOOGLE_MAPS_TEXT,
  googleAttributionMode,
  googleLogoVariant,
  normalizeOlAttributions,
  pickAttributionText,
  resolveAttributionLang,
  sanitizeSourceAttributions,
  ATTRIBUTION_MAX_LINES
} from "../src/attribution";

const OSM_ATTR = "©︎ OpenStreetMap contributors";
const GSI_ATTR = { ja: "国土地理院", en: "The Geospatial Information Authority of Japan" };

function source(attr: unknown, wmts = true) {
  return { get: (key: string) => (key === "attr" ? attr : undefined), isWmts: () => wmts };
}

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute("lang");
});

describe("pickAttributionText", () => {
  it("文字列はそのまま", () => {
    expect(pickAttributionText(OSM_ATTR, "ja")).toBe(OSM_ATTR);
  });
  it("言語が一致する値を選ぶ", () => {
    expect(pickAttributionText(GSI_ATTR, "ja")).toBe("国土地理院");
    expect(pickAttributionText(GSI_ATTR, "en")).toBe(GSI_ATTR.en);
  });
  it("UI の pickLocalized と同じく、地域を外した言語には寄せない（一致しなければ en）", () => {
    expect(pickAttributionText(GSI_ATTR, "ja-JP")).toBe(GSI_ATTR.en);
  });
  it("無い言語は en、en も無ければ最初の空でない値", () => {
    expect(pickAttributionText(GSI_ATTR, "ko")).toBe(GSI_ATTR.en);
    expect(pickAttributionText({ ja: "", fr: "IGN", de: "BKG" }, "ko")).toBe("IGN");
  });
  it("値が無ければ undefined", () => {
    expect(pickAttributionText(undefined, "ja")).toBeUndefined();
    expect(pickAttributionText(null, "ja")).toBeUndefined();
    expect(pickAttributionText({ ja: "" }, "ja")).toBeUndefined();
  });
});

describe("言語の解決", () => {
  it("最も近い lang 属性を使う（空の lang は飛ばす）", () => {
    document.body.innerHTML = `<div lang="en"><section lang=""><div id="map"></div></section></div>`;
    expect(closestLang(document.getElementById("map"))).toBe("en");
  });
  it("影の DOM の境界を越えて host の祖先を見る", () => {
    document.body.innerHTML = `<div id="host" lang="ja"></div>`;
    const host = document.getElementById("host")!;
    const shadow = host.attachShadow({ mode: "open" });
    const inner = document.createElement("div");
    shadow.appendChild(inner);
    expect(closestLang(inner)).toBe("ja");
  });
  it("UI と同じ順: 地図の要素の lang → appOption.lang → 設定ファイルの lang → 祖先の lang → ブラウザ", () => {
    document.body.innerHTML = `<div lang="fr"><div id="map"></div></div>`;
    const map = document.getElementById("map")!;
    expect(resolveAttributionLang(map, "en", "ja")).toBe("en");
    expect(resolveAttributionLang(map, undefined, "ja")).toBe("ja");
    expect(resolveAttributionLang(map, 3, "")).toBe("fr");
    map.setAttribute("lang", "ko");
    expect(resolveAttributionLang(map, "en", "ja")).toBe("ko");
    document.body.innerHTML = `<div id="map2"></div>`;
    expect(resolveAttributionLang(document.getElementById("map2"), 3, "")).toBe(navigator.language || "en");
  });
  it("<html lang=\"en\"> で設定の lang が ja なら ja（その逆も）", () => {
    document.documentElement.setAttribute("lang", "en");
    document.body.innerHTML = `<div id="map"></div>`;
    expect(resolveAttributionLang(document.getElementById("map"), undefined, "ja")).toBe("ja");
    document.documentElement.setAttribute("lang", "ja");
    expect(resolveAttributionLang(document.getElementById("map"), undefined, "en")).toBe("en");
  });
  it("<maplat-ui> の中: currentLang があればそれを使う（地図の要素の lang・<html lang> より先）", () => {
    document.documentElement.setAttribute("lang", "en");
    document.body.innerHTML = `<maplat-ui id="ui"><div id="map" lang="fr"></div></maplat-ui>`;
    const ui = document.getElementById("ui")! as any;
    Object.defineProperty(ui, "currentLang", { get: () => "ja", configurable: true });
    expect(resolveAttributionLang(document.getElementById("map"), "en", "en")).toBe("ja");
  });
  it("<maplat-ui> の currentLang の getter が例外を投げたら、仮の順で選ぶ", () => {
    document.body.innerHTML = `<maplat-ui id="ui" lang="ko"><div id="map"></div></maplat-ui>`;
    Object.defineProperty(document.getElementById("ui")!, "currentLang", {
      get: () => {
        throw new Error("not ready");
      },
      configurable: true
    });
    expect(resolveAttributionLang(document.getElementById("map"), "ja", "ja")).toBe("ko");
  });
  it("<maplat-ui> の currentLang が空の文字列なら、仮の順で選ぶ", () => {
    document.body.innerHTML = `<maplat-ui id="ui"><div id="map"></div></maplat-ui>`;
    Object.defineProperty(document.getElementById("ui")!, "currentLang", { get: () => "", configurable: true });
    expect(resolveAttributionLang(document.getElementById("map"), undefined, "en")).toBe("en");
  });
  it("<maplat-ui> が未定義（currentLang が無い）なら、その lang 属性を appOption・設定より先に見る", () => {
    document.body.innerHTML = `<maplat-ui lang="en"><div id="map"></div></maplat-ui>`;
    expect(resolveAttributionLang(document.getElementById("map"), "ja", "ja")).toBe("en");
  });
  it("UI の normalizeLang と同じく zh-HK・zh-Hant は zh-TW", () => {
    expect(normalizeAttributionLang("zh-HK")).toBe("zh-TW");
    expect(normalizeAttributionLang("zh-Hant")).toBe("zh-TW");
    expect(normalizeAttributionLang("zh-CN")).toBe("zh-CN");
    document.body.innerHTML = `<div id="map"></div>`;
    expect(resolveAttributionLang(document.getElementById("map"), "zh-hk")).toBe("zh-TW");
  });
});

describe("出す source の選び方", () => {
  const osm = source(OSM_ATTR);
  const gsi = source(GSI_ATTR);
  const hist = source("古地図の所蔵者", false);
  const overlay = source({ ja: "重ね地図の出典", en: "Overlay credit" });

  it("前面が basemap: その地図だけ", () => {
    expect(displayedAttributionSources({ front: osm })).toEqual([osm]);
  });
  it("前面が古地図: 古地図は外し、背面の basemap を出す", () => {
    expect(displayedAttributionSources({ front: hist, back: gsi })).toEqual([gsi]);
  });
  it("重ね地図: 下の basemap と重ね地図の両方", () => {
    expect(displayedAttributionSources({ front: gsi, overlay })).toEqual([gsi, overlay]);
  });
  it("同じ source は 1 回だけ", () => {
    expect(displayedAttributionSources({ front: osm, overlay: osm, back: osm })).toEqual([osm]);
  });
  it("文字列は言語を選び、空と重複を除く", () => {
    const sameText = source({ ja: "国土地理院" });
    const empty = source(undefined);
    expect(attributionTexts([gsi, sameText, empty, overlay], "ja")).toEqual([
      "国土地理院",
      "重ね地図の出典"
    ]);
  });
});

describe("AttributionDisplay", () => {
  function setup(lang?: string) {
    document.body.innerHTML = `<div id="wrap"${lang ? ` lang="${lang}"` : ""}><div id="map"></div></div>`;
    const map = document.getElementById("map")!;
    const display = new AttributionDisplay(map, () => resolveAttributionLang(map));
    return { map, display };
  }
  const flush = () => new Promise(resolve => setTimeout(resolve, 0));

  it("地図の箱の最後の子に置き、出典を区切って並べる", () => {
    const { map, display } = setup("ja");
    display.update([source(GSI_ATTR), source(OSM_ATTR)]);
    expect(map.lastElementChild).toBe(display.element);
    expect(display.element.hidden).toBe(false);
    const items = [...display.element.querySelectorAll(".maplat-attribution-item")].map(e => e.textContent);
    expect(items).toEqual(["国土地理院", OSM_ATTR]);
    expect(display.element.textContent).toBe(`国土地理院 | ${OSM_ATTR}`);
    expect(display.element.querySelector(".maplat-attribution-sep")!.getAttribute("aria-hidden")).toBe("true");
  });

  it("出すものが無ければ隠す", () => {
    const { display } = setup("ja");
    display.update([source(undefined)]);
    expect(display.element.hidden).toBe(true);
    expect(display.element.childElementCount).toBe(0);
  });

  it("値は sanitize してから入れる（リンクは残し、スクリプトは落とす）", () => {
    const { display } = setup("ja");
    display.update([
      source('<a href="https://www.openstreetmap.org/copyright" target="_blank">© OSM</a><img src=x onerror="alert(1)"><script>alert(2)</script>')
    ]);
    const html = display.element.innerHTML;
    expect(html).toContain('href="https://www.openstreetmap.org/copyright"');
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("<script");
  });

  it("祖先の lang 属性を変えると、出典の言語を作り直す", async () => {
    const { display } = setup("ja");
    display.update([source(GSI_ATTR)]);
    expect(display.element.textContent).toBe("国土地理院");
    document.getElementById("wrap")!.setAttribute("lang", "en");
    await flush();
    expect(display.element.textContent).toBe(GSI_ATTR.en);
    document.documentElement.setAttribute("lang", "ja");
    document.getElementById("wrap")!.removeAttribute("lang");
    await flush();
    expect(display.element.textContent).toBe("国土地理院");
  });

  it("地図の要素の lang 属性を変えても作り直す", async () => {
    const { map, display } = setup("ja");
    display.update([source(GSI_ATTR)]);
    map.setAttribute("lang", "en");
    await flush();
    expect(display.element.textContent).toBe(GSI_ATTR.en);
  });

  it("attr の無い地図は OpenLayers の source の出典を読む（Promise も受ける・空では消さない）", async () => {
    const { display } = setup("ja");
    let copyright: unknown = "Map data ©2026 Google";
    const frames: unknown[] = [];
    const google = {
      get: () => undefined,
      isWmts: () => true,
      getAttributions: () => (frameState: unknown) => {
        frames.push(frameState);
        return Promise.resolve(copyright);
      }
    };
    display.update([google, source(GSI_ATTR)]);
    expect(display.element.textContent).toBe("国土地理院");
    display.refreshDynamic([google], { frame: 1 });
    await flush();
    expect(frames).toEqual([{ frame: 1 }]);
    expect(display.element.textContent).toBe("Map data ©2026 Google | 国土地理院");
    // 動かしている途中など、値が返らないときは前の値のまま
    copyright = undefined;
    display.refreshDynamic([google], { frame: 2 });
    await flush();
    expect(display.element.textContent).toBe("Map data ©2026 Google | 国土地理院");
    // 範囲が変わって値が変わったら作り直す
    copyright = ["Map data ©2026 Google, ZENRIN"];
    display.refreshDynamic([google], { frame: 3 });
    await flush();
    expect(display.element.textContent).toBe("Map data ©2026 Google, ZENRIN | 国土地理院");
    // 表示から外れたら、遅れて届いた値も出さない
    display.update([source(OSM_ATTR)]);
    display.refreshDynamic([google], { frame: 4 });
    await flush();
    expect(display.element.textContent).toBe(OSM_ATTR);
  });

  it("空白だけの attr は無いものとみなし、OpenLayers の出典を読む", async () => {
    const { display } = setup("ja");
    const blank = {
      get: (key: string) => (key === "attr" ? "   " : undefined),
      isWmts: () => true,
      getAttributions: () => () => "OL の出典"
    };
    const blankLocalized = {
      get: (key: string) => (key === "attr" ? { ja: " ", en: "" } : undefined),
      isWmts: () => true,
      getAttributions: () => () => ["別の OL の出典"]
    };
    display.update([blank, blankLocalized]);
    expect(display.element.hidden).toBe(true);
    display.refreshDynamic([blank, blankLocalized], {});
    await flush();
    expect(display.element.textContent).toBe("OL の出典 | 別の OL の出典");
  });

  it("地図の設定の attr があれば OpenLayers の出典は読まない", async () => {
    const { display } = setup("ja");
    let called = false;
    const configured = {
      get: (key: string) => (key === "attr" ? "設定の出典" : undefined),
      isWmts: () => true,
      getAttributions: () => () => {
        called = true;
        return "OL の出典";
      }
    };
    display.update([configured]);
    display.refreshDynamic([configured], {});
    await flush();
    expect(called).toBe(false);
    expect(display.element.textContent).toBe("設定の出典");
  });

  it("OpenLayers の出典の値を文字列の配列にする", () => {
    expect(normalizeOlAttributions("a")).toEqual(["a"]);
    expect(normalizeOlAttributions([" a ", "", 3, "b"])).toEqual(["a", "b"]);
    expect(normalizeOlAttributions(undefined)).toEqual([]);
  });

  it("地図の箱の中身が消されても、次の描画で最後の子に戻す", () => {
    const { map, display } = setup("ja");
    display.update([source(OSM_ATTR)]);
    map.replaceChildren(document.createElement("canvas"));
    display.update([source(OSM_ATTR)]);
    expect(map.lastElementChild).toBe(display.element);
  });

  it("dispose で要素を外し、lang の監視もやめる", async () => {
    const { map, display } = setup("ja");
    display.update([source(GSI_ATTR)]);
    display.dispose();
    expect(map.querySelector(".maplat-attribution")).toBeNull();
    document.getElementById("wrap")!.setAttribute("lang", "en");
    await flush();
    expect(map.querySelector(".maplat-attribution")).toBeNull();
    display.update([source(OSM_ATTR)]);
    expect(map.querySelector(".maplat-attribution")).toBeNull();
  });

  it("スタイルは文書に 1 回だけ入れる", () => {
    setup("ja");
    const map2 = document.createElement("div");
    document.body.appendChild(map2);
    new AttributionDisplay(map2, () => "ja");
    expect(document.querySelectorAll("#maplat-attribution-style").length).toBe(1);
  });
});

describe("Google Maps のロゴ", () => {
  const GOOGLE_COPYRIGHT = "Map data ©2026 Google";
  /** Google の地図（GoogleMap）の形: attr は無く、OpenLayers の出典を持ち、googleMapType を持つ。 */
  function googleSource(mapType: string, copyright = GOOGLE_COPYRIGHT) {
    return {
      get: () => undefined,
      isWmts: () => true,
      getAttributions: () => () => copyright,
      googleMapType: mapType
    };
  }
  function setup() {
    document.body.innerHTML = `<div id="map" lang="ja"></div>`;
    const map = document.getElementById("map")!;
    const display = new AttributionDisplay(map, () => resolveAttributionLang(map));
    return { map, display };
  }
  /** 出典の箱の幅の測り方（jsdom はレイアウトしないので、測った値を差し替える）。 */
  function stubWidth(display: AttributionDisplay, width: number) {
    display.element.getBoundingClientRect = () => ({ width }) as DOMRect;
  }
  const flush = () => new Promise(resolve => setTimeout(resolve, 0));

  it("Google の地図があるときだけ、種類を返す（衛星は dark、それ以外は light。並びの最初のもの）", () => {
    expect(googleLogoVariant([source(OSM_ATTR)])).toBeUndefined();
    expect(googleLogoVariant([])).toBeUndefined();
    expect(googleLogoVariant([googleSource("roadmap")])).toBe("light");
    expect(googleLogoVariant([googleSource("terrain")])).toBe("light");
    expect(googleLogoVariant([googleSource("satellite")])).toBe("dark");
    expect(googleLogoVariant([source(OSM_ATTR), googleSource("satellite"), googleSource("roadmap")])).toBe("dark");
    expect(googleLogoVariant([{ ...source(OSM_ATTR), googleMapType: "" }])).toBeUndefined();
  });

  it("使える幅がロゴと左右の余白（125px）より狭いときだけ文字。測れないときはロゴ", () => {
    expect(GOOGLE_LOGO_MIN_WIDTH).toBe(125);
    expect(googleAttributionMode(125)).toBe("logo");
    expect(googleAttributionMode(124.5)).toBe("text");
    expect(googleAttributionMode(0)).toBe("logo");
    expect(googleAttributionMode(Number.NaN)).toBe("logo");
  });

  it("Google の地図ではロゴを出典の文字の左隣に出す（読み上げは Google Maps）", async () => {
    const { display } = setup();
    const google = googleSource("roadmap");
    display.update([google]);
    // copyright を取りに行く前からロゴは出す
    expect(display.googleAttribution).toBe("logo");
    expect(display.element.hidden).toBe(false);
    display.refreshDynamic([google], {});
    await flush();
    // 最下段の行に「ロゴ・Google の出典」の順（ほかの出典が無ければ行だけ）
    expect([...display.element.children].map(e => e.className)).toEqual(["maplat-attribution-google"]);
    const children = [...display.element.firstElementChild!.children];
    expect(children.map(e => e.className)).toEqual(["maplat-attribution-google-logo", "maplat-attribution-text"]);
    const logo = children[0] as HTMLElement;
    expect(logo.getAttribute("role")).toBe("img");
    expect(logo.getAttribute("aria-label")).toBe(GOOGLE_MAPS_TEXT);
    expect(logo.dataset.variant).toBe("light");
    const svg = logo.querySelector("svg")!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 105 22");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.querySelector("[id]")).toBeNull();
    expect(display.element.dataset.googleMaps).toBe("logo");
    // 出典の文字は copyright だけ（ロゴの代わりの文字は足さない）
    expect([...display.element.querySelectorAll(".maplat-attribution-item")].map(e => e.textContent)).toEqual([
      GOOGLE_COPYRIGHT
    ]);
  });

  it("衛星の地図は白い字・濃い枠のロゴ", () => {
    const { display } = setup();
    display.update([googleSource("satellite")]);
    const logo = display.element.querySelector<HTMLElement>(".maplat-attribution-google-logo")!;
    expect(logo.dataset.variant).toBe("dark");
    expect(logo.querySelector('g[opacity="0.8"] path')!.getAttribute("fill")).toBe("#1E1E1E");
  });

  it("地図の設定に attr がある Google の地図でも、ロゴと表示範囲の copyright を出し、attr は別の箱にして上に出す", async () => {
    const { display } = setup();
    const google = { ...googleSource("roadmap"), get: (key: string) => (key === "attr" ? "Example basemap note" : undefined) };
    display.update([google]);
    expect(display.googleAttribution).toBe("logo");
    // copyright を読む前は attr だけ
    expect(display.texts).toEqual(["Example basemap note"]);
    display.refreshDynamic([google], {});
    await flush();
    expect(display.texts).toEqual([GOOGLE_COPYRIGHT, "Example basemap note"]);
    const items = [...display.element.querySelectorAll(".maplat-attribution-google .maplat-attribution-item")].map(
      e => e.textContent
    );
    // Google の行は copyright だけ。attr（アプリの作者が書く値）は Google の出典と別の箱
    expect(items).toEqual([GOOGLE_COPYRIGHT]);
    const children = [...display.element.children] as HTMLElement[];
    expect(children.map(e => e.className)).toEqual([
      "maplat-attribution-text maplat-attribution-clamp maplat-attribution-base maplat-attribution-stacked",
      "maplat-attribution-google"
    ]);
    expect(children[0].textContent).toBe("Example basemap note");
  });

  it("attr と copyright が同じ文字列なら 1 回だけ", () => {
    const google = { ...googleSource("roadmap"), get: (key: string) => (key === "attr" ? GOOGLE_COPYRIGHT : undefined) };
    const dynamic = new Map([[google, [GOOGLE_COPYRIGHT]]]);
    expect(attributionTexts([google], "ja", dynamic)).toEqual([GOOGLE_COPYRIGHT]);
  });

  it("Google の copyright・背景地図・重ね地図の出典を分ける", () => {
    const google = googleSource("roadmap");
    const overlay = source(OSM_ATTR);
    const dynamic = new Map([[google, [GOOGLE_COPYRIGHT]]]);
    expect(attributionGroups([google, overlay], "ja", dynamic, [overlay])).toEqual({
      google: [GOOGLE_COPYRIGHT],
      base: [],
      overlay: [OSM_ATTR]
    });
    // 重ね地図と言われなければ背景地図
    expect(attributionGroups([google, overlay], "ja", dynamic)).toEqual({
      google: [GOOGLE_COPYRIGHT],
      base: [OSM_ATTR],
      overlay: []
    });
    // 平らな並びは source の順のまま
    expect(attributionTexts([google, overlay], "ja", dynamic)).toEqual([GOOGLE_COPYRIGHT, OSM_ATTR]);
  });

  it("Google の地図の上に重ね地図があると、重ね地図の出典は別の箱にして Google の行の上に置く", async () => {
    const { display } = setup();
    const google = googleSource("roadmap");
    const overlay = source(GSI_ATTR);
    display.update(displayedAttributionSources({ front: google, overlay }), [overlay]);
    display.refreshDynamic([google], {});
    await flush();
    const children = [...display.element.children] as HTMLElement[];
    expect(children.map(e => e.className)).toEqual([
      "maplat-attribution-text maplat-attribution-clamp maplat-attribution-overlay maplat-attribution-stacked",
      "maplat-attribution-google"
    ]);
    expect(children[0].textContent).toBe("国土地理院");
    expect(children[1].querySelector(".maplat-attribution-text")!.textContent).toBe(GOOGLE_COPYRIGHT);
    // 区切りの " | " で Google の出典とつながない
    expect(display.element.textContent).not.toContain(" | ");
  });

  it("重ね地図が無ければ、背景地図の箱が 1 つ（行数の上限付き）", () => {
    const { display } = setup();
    display.update([source(GSI_ATTR), source(OSM_ATTR)]);
    expect([...display.element.children].map(e => e.className)).toEqual([
      "maplat-attribution-text maplat-attribution-clamp maplat-attribution-base"
    ]);
    expect(display.element.textContent).toBe(`国土地理院 | ${OSM_ATTR}`);
  });

  it("Google の地図が無くても、重ね地図の出典は背景地図と別の箱にして上に出す", () => {
    const { display } = setup();
    const overlay = source(GSI_ATTR);
    display.update(displayedAttributionSources({ front: source(OSM_ATTR), overlay }), [overlay]);
    const children = [...display.element.children] as HTMLElement[];
    expect(children.map(e => e.className)).toEqual([
      "maplat-attribution-text maplat-attribution-clamp maplat-attribution-overlay maplat-attribution-stacked",
      "maplat-attribution-text maplat-attribution-clamp maplat-attribution-base"
    ]);
    expect(children.map(e => e.textContent)).toEqual(["国土地理院", OSM_ATTR]);
    expect(display.texts).toEqual([OSM_ATTR, "国土地理院"]);
    // overlays に sources に無いものを渡しても無視する
    display.update([source(OSM_ATTR)], [overlay]);
    expect([...display.element.children].map(e => e.className)).toEqual([
      "maplat-attribution-text maplat-attribution-clamp maplat-attribution-base"
    ]);
  });

  it("狭いときはロゴの代わりに文字 Google Maps を出典の先頭に出す", async () => {
    const { display } = setup();
    stubWidth(display, 100);
    const google = googleSource("roadmap");
    display.update([google]);
    display.refreshDynamic([google], {});
    await flush();
    expect(display.googleAttribution).toBe("text");
    expect(display.element.querySelector(".maplat-attribution-google-logo")).toBeNull();
    expect(display.element.querySelector(".maplat-attribution-google-text")!.closest(".maplat-attribution-google")).not.toBeNull();
    const items = [...display.element.querySelectorAll(".maplat-attribution-item")].map(e => e.textContent);
    expect(items).toEqual([GOOGLE_MAPS_TEXT, GOOGLE_COPYRIGHT]);
    expect(display.element.textContent).toBe(`${GOOGLE_MAPS_TEXT} | ${GOOGLE_COPYRIGHT}`);
    // 測るあいだに当てた一時の style は戻す
    expect(display.element.style.width).toBe("");
    expect(display.element.style.display).toBe("");
  });

  it("Google の地図から外れたら、ロゴも data 属性も消える（言語を変えると描き直し、ロゴは出したまま）", async () => {
    const { map, display } = setup();
    display.update([googleSource("roadmap"), source(GSI_ATTR)]);
    expect(display.googleAttribution).toBe("logo");
    const before = display.element.querySelector(".maplat-attribution-google-logo");
    expect(display.element.querySelector(".maplat-attribution-base")!.textContent).toBe("国土地理院");
    let renders = 0;
    const render = display.render.bind(display);
    display.render = () => {
      renders++;
      render();
    };
    map.setAttribute("lang", "en");
    await flush();
    // 描き直しが起きた（回数・要素の作り直し・重ね地図の出典の言語）
    expect(renders).toBe(1);
    const after = display.element.querySelector(".maplat-attribution-google-logo");
    expect(after).not.toBeNull();
    expect(after).not.toBe(before);
    expect(display.element.querySelector(".maplat-attribution-base")!.textContent).toBe(GSI_ATTR.en);
    expect(display.googleAttribution).toBe("logo");
    display.update([source(OSM_ATTR)]);
    expect(display.googleAttribution).toBeUndefined();
    expect(display.element.dataset.googleMaps).toBeUndefined();
    expect(display.element.querySelector(".maplat-attribution-google-logo")).toBeNull();
    expect(display.element.textContent).toBe(OSM_ATTR);
  });

  it("前面が古地図で背面が Google の地図のときも出す", () => {
    const { display } = setup();
    const hist = { ...source(undefined, false) };
    const google = googleSource("satellite");
    display.update(displayedAttributionSources({ front: hist, back: google }));
    expect(display.googleAttribution).toBe("logo");
  });

  it("地図の箱の大きさが変わると、ロゴと文字を決め直す（変わるときだけ描き直す）。dispose で監視をやめる", () => {
    const original = globalThis.ResizeObserver;
    const observers: { callback: () => void; disconnected: boolean }[] = [];
    globalThis.ResizeObserver = class {
      record: { callback: () => void; disconnected: boolean };
      constructor(callback: () => void) {
        this.record = { callback, disconnected: false };
        observers.push(this.record);
      }
      observe() {
        return undefined;
      }
      unobserve() {
        return undefined;
      }
      disconnect() {
        this.record.disconnected = true;
      }
    } as unknown as typeof ResizeObserver;
    try {
      const { display } = setup();
      display.update([googleSource("roadmap")]);
      expect(display.googleAttribution).toBe("logo");
      let renders = 0;
      const render = display.render.bind(display);
      display.render = () => {
        renders++;
        render();
      };
      observers[0].callback();
      expect(renders).toBe(0);
      stubWidth(display, 90);
      observers[0].callback();
      expect(renders).toBe(1);
      expect(display.googleAttribution).toBe("text");
      stubWidth(display, 300);
      observers[0].callback();
      expect(display.googleAttribution).toBe("logo");
      display.dispose();
      expect(observers[0].disconnected).toBe(true);
    } finally {
      globalThis.ResizeObserver = original;
    }
  });
});
describe("source から読んだ出典は狭い許可表で洗う", () => {
  function setup() {
    document.body.innerHTML = `<div id="map" lang="ja"></div>`;
    const map = document.getElementById("map")!;
    const display = new AttributionDisplay(map, () => resolveAttributionLang(map));
    return { map, display };
  }
  const flush = () => new Promise(resolve => setTimeout(resolve, 0));
  /** attr の無い現代の地図（OpenLayers の出典を返す）。 */
  function olSource(value: unknown, googleMapType?: string) {
    return {
      get: () => undefined,
      isWmts: () => true,
      getAttributions: () => () => value,
      ...(googleMapType ? { googleMapType } : {})
    };
  }
  async function show(value: unknown, googleMapType?: string) {
    const { display } = setup();
    const src = olSource(value, googleMapType);
    display.update([src]);
    display.refreshDynamic([src], {});
    await flush();
    return display;
  }
  const items = (display: AttributionDisplay) => [...display.element.querySelectorAll(".maplat-attribution-item")];

  // Map Tiles API の viewport の copyright の例（文字だけ）
  const GOOGLE_COPYRIGHTS = [
    "Map data ©2026 Google",
    "Imagery ©2026 Airbus, CNES / Airbus, Maxar Technologies Map data ©2026",
    "Map data ©2026 Google, ZENRIN",
    "Imagery ©2026 TerraMetrics, Map data ©2026 Google, INEGI",
    "©︎ OpenStreetMap contributors"
  ];

  it("Google の copyright（文字だけ）は、洗っても文字が変わらない", async () => {
    expect(sanitizeSourceAttributions(GOOGLE_COPYRIGHTS)).toEqual(GOOGLE_COPYRIGHTS);
    for (const copyright of GOOGLE_COPYRIGHTS) {
      for (const mapType of ["roadmap", "satellite"]) {
        const display = await show(copyright, mapType);
        expect(display.texts).toEqual([copyright]);
        expect(items(display).map(e => e.innerHTML)).toEqual([copyright]);
        expect(items(display).map(e => e.textContent)).toEqual([copyright]);
        // ロゴも今までどおり
        expect(display.googleAttribution).toBe("logo");
      }
    }
  });

  it("外の値の img・class・style・javascript: は落ち、リンクには rel が付く", async () => {
    const hostile =
      '<a href="https://example.org/"><img src="https://example.org/x.png" width="4000" height="4000"></a>' +
      '<span class="huge" style="font-size:400px">Example</span>' +
      '<a href="javascript:alert(1)">bad</a>' +
      '<img src=x onerror="alert(2)"><script>alert(3)</script>';
    const display = await show(hostile);
    const html = display.element.innerHTML;
    expect(display.element.querySelector("img")).toBeNull();
    expect(html).not.toContain("class=\"huge\"");
    expect(html).not.toContain("style=");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("<script");
    const links = [...display.element.querySelectorAll(".maplat-attribution-item a")];
    expect(links.map(a => a.getAttribute("href"))).toEqual(["https://example.org/", null]);
    for (const link of links) {
      if (!link.hasAttribute("href")) continue;
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("target")).toBe("_blank");
    }
    // 文字は残る
    expect(display.element.textContent).toBe("Examplebad");
  });

  it("Google の copyright に img が入っていても落とし、ロゴは今までどおり出す", async () => {
    const display = await show(
      'Map data ©2026 Google<a href="https://example.org/"><img src="https://example.org/x.png" width="4000" height="4000"></a>',
      "roadmap"
    );
    expect(display.googleAttribution).toBe("logo");
    const google = display.element.querySelector(".maplat-attribution-google .maplat-attribution-text")!;
    expect(google.querySelector("img")).toBeNull();
    expect(google.textContent).toBe("Map data ©2026 Google");
    // ロゴ（埋め込みの SVG）は洗う対象ではない
    expect(display.element.querySelector(".maplat-attribution-google-logo svg")).not.toBeNull();
  });

  it("洗って何も残らない値では、前の値を消さない", async () => {
    const { display } = setup();
    let value: unknown = "Map data ©2026 Google";
    const src = { ...olSource(undefined, "roadmap"), getAttributions: () => () => value };
    display.update([src]);
    display.refreshDynamic([src], {});
    await flush();
    value = '<img src="https://example.org/x.png">';
    display.refreshDynamic([src], {});
    await flush();
    expect(display.texts).toEqual(["Map data ©2026 Google"]);
  });

  it("地図の設定の attr は今までどおり広い許可表（img・class・width も通る）", () => {
    const { display } = setup();
    display.update([
      source(
        '<a href="https://example.org/" target="_blank"><img src="https://example.org/logo.png" class="logo" width="20" height="20" alt="Example"></a> Example'
      )
    ]);
    const img = display.element.querySelector(".maplat-attribution-item img")!;
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("https://example.org/logo.png");
    expect(img.getAttribute("class")).toBe("logo");
    expect(img.getAttribute("width")).toBe("20");
    expect(display.element.querySelector(".maplat-attribution-item a")!.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("OpenLayers の source の既定の出典（リンクを含む）が正しく出る", async () => {
    const frameState = { extent: [-20037508, -20037508, 20037508, 20037508], viewState: { projection: undefined } };
    const sources = [
      new OSM(),
      new StadiaMaps({ layer: "stamen_toner" }),
      new XYZ({ url: "https://example.org/{z}/{x}/{y}.png", attributions: '&copy; <a href="https://example.org/" target="_blank">Example</a>' }),
      new TileJSON({
        tileJSON: {
          tiles: ["https://example.org/{z}/{x}/{y}.png"],
          attribution: '<a href="https://example.org/tilejson">Example TileJSON</a> contributors'
        }
      })
    ];
    const { display } = setup();
    display.update(sources as never);
    display.refreshDynamic(sources as never, frameState);
    await flush();
    expect(display.element.textContent).toBe(
      [
        "© OpenStreetMap contributors.",
        "© Stadia Maps",
        "© Stamen Design",
        "© OpenMapTiles",
        // StadiaMaps の OSM の出典は OSM の source と同じ文字列なので 1 回だけ
        "© Example",
        "Example TileJSON contributors"
      ].join(" | ")
    );
    const links = [...display.element.querySelectorAll(".maplat-attribution-item a")];
    expect(links.map(a => a.getAttribute("href"))).toEqual([
      "https://www.openstreetmap.org/copyright",
      "https://www.stadiamaps.com/",
      "https://stamen.com/",
      "https://openmaptiles.org/",
      "https://example.org/",
      "https://example.org/tilejson"
    ]);
    for (const link of links) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("target")).toBe("_blank");
    }
  });

  it("Bing Maps の利用規約のリンクは、class だけ落ちてリンクは残る", () => {
    const tos =
      '<a class="ol-attribution-bing-tos" href="https://www.microsoft.com/maps/product/terms.html" target="_blank">Terms of Use</a>';
    expect(sanitizeSourceAttributions([tos])).toEqual([
      '<a href="https://www.microsoft.com/maps/product/terms.html" target="_blank" rel="noopener noreferrer">Terms of Use</a>'
    ]);
  });
});


describe("出典の箱の行数の上限（Google の copyright は切らない）", () => {
  function setup() {
    document.body.innerHTML = `<div id="map" lang="ja"></div>`;
    const map = document.getElementById("map")!;
    const display = new AttributionDisplay(map, () => resolveAttributionLang(map));
    return { map, display };
  }
  const flush = () => new Promise(resolve => setTimeout(resolve, 0));
  function olSource(value: unknown, extra: Record<string, unknown> = {}) {
    return { get: () => undefined, isWmts: () => true, getAttributions: () => () => value, ...extra };
  }
  const LONG = "█".repeat(6000);
  const HOSTILE = `<a href="https://example.org/"><p>${LONG}</p></a>`;
  const boxes = (display: AttributionDisplay) => [...display.element.children] as HTMLElement[];

  it("Google の copyright 以外の箱は 2 行まで（超えた分は「…」・高さもその行数まで・はみ出しは隠す）", () => {
    expect(ATTRIBUTION_MAX_LINES).toBe(2);
    setup();
    const css = document.getElementById("maplat-attribution-style")!.textContent!;
    const rule = css.slice(css.indexOf(".maplat-attribution-clamp {"), css.indexOf("}", css.indexOf(".maplat-attribution-clamp {")));
    expect(rule).toContain("display: -webkit-box;");
    expect(rule).toContain("-webkit-box-orient: vertical;");
    expect(rule).toContain("-webkit-line-clamp: 2;");
    expect(rule).toContain("max-height: calc(2 * 1.4em + 2px);");
    expect(rule).toContain("max-width: 100%;");
    expect(rule).toContain("box-sizing: border-box;");
    expect(rule).toContain("overflow: hidden;");
    // Google の行の箱には付かない規則であること（.maplat-attribution-text 全体には付けない）
    expect(css).not.toMatch(/\.maplat-attribution-text \{[^}]*line-clamp/);
  });

  it("source から読んだ長い値・設定の長い attr は、背景地図の箱・重ね地図の箱のどちらでも上限付きの箱に入る", async () => {
    const { display } = setup();
    const fetched = olSource(HOSTILE);
    const OVERLAY_LONG = "▒".repeat(6000);
    const overlay = source(`<p>${OVERLAY_LONG}</p>`);
    display.update([fetched, overlay], [overlay]);
    display.refreshDynamic([fetched], {});
    await flush();
    const [overlayBox, baseBox] = boxes(display);
    expect(overlayBox.classList.contains("maplat-attribution-overlay")).toBe(true);
    expect(baseBox.classList.contains("maplat-attribution-base")).toBe(true);
    for (const [box, text] of [
      [overlayBox, OVERLAY_LONG],
      [baseBox, LONG]
    ] as const) {
      expect(box.classList.contains("maplat-attribution-clamp")).toBe(true);
      // 文字は DOM に残す（切るのは表示だけ。全文は UI の地図情報で見る）
      expect(box.textContent).toBe(text);
    }
    // source の値のリンクは狭い許可表のとおり
    expect(baseBox.querySelector("a")!.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("Google の copyright は上限を当てず、全文を出す（衛星の約 70 字・それより長くても）", async () => {
    const satellite = "Imagery ©2026 Airbus, CNES / Airbus, Maxar Technologies Map data ©2026";
    for (const copyright of [satellite, `${satellite} ${"Example ".repeat(40).trim()}`]) {
      const { display } = setup();
      const google = olSource(copyright, { googleMapType: "satellite" });
      display.update([google]);
      display.refreshDynamic([google], {});
      await flush();
      const box = display.element.querySelector<HTMLElement>(".maplat-attribution-google .maplat-attribution-text")!;
      expect(box.classList.contains("maplat-attribution-clamp")).toBe(false);
      expect(box.querySelector(".maplat-attribution-item")!.innerHTML).toBe(copyright);
      expect(display.element.querySelector(".maplat-attribution-clamp")).toBeNull();
    }
  });

  it("Google の copyright も狭い許可表で洗う（画像は落ちる）", async () => {
    const { display } = setup();
    const google = olSource(`Map data ©2026 Google<a href="https://example.org/"><img src="https://example.org/x.png" width="4000"></a>`, {
      googleMapType: "roadmap"
    });
    display.update([google]);
    display.refreshDynamic([google], {});
    await flush();
    expect(display.element.querySelector("img")).toBeNull();
    expect(display.element.querySelector(".maplat-attribution-google a")!.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("重複は表示される文字で比べる（設定の A &amp; B と source の A & B は 1 回だけ）。texts は元の値を返す", async () => {
    const google = olSource("Map data ©2026 A & B", {
      googleMapType: "roadmap",
      get: (key: string) => (key === "attr" ? "Map data ©2026 A &amp; B" : undefined)
    });
    const { display } = setup();
    display.update([google]);
    display.refreshDynamic([google], {});
    await flush();
    expect(display.texts).toEqual(["Map data ©2026 A & B"]);
    expect([...display.element.querySelectorAll(".maplat-attribution-item")].map(e => e.textContent)).toEqual([
      "Map data ©2026 A & B"
    ]);
    // 重ね地図の attr が Google の copyright と同じ文字なら、重ね地図の箱は出さない
    const overlay = source("Map data ©2026 A &amp; B");
    display.update([google, overlay], [overlay]);
    display.refreshDynamic([google], {});
    await flush();
    expect(display.element.querySelector(".maplat-attribution-overlay")).toBeNull();
    // source から読んだ値の texts は洗う前の元の値
    const plain = olSource("Example & Co.");
    display.update([plain]);
    display.refreshDynamic([plain], {});
    await flush();
    expect(display.texts).toEqual(["Example & Co."]);
    expect(display.element.querySelector(".maplat-attribution-item")!.innerHTML).toBe("Example &amp; Co.");
  });
});

// <maplat-ui> を定義すると文書全体に残るので、このファイルの最後に置く
describe("<maplat-ui> の定義を待つ", () => {
  const flush = () => new Promise(resolve => setTimeout(resolve, 0));

  it("定義の前に描いた出典を、定義の後に一度だけ UI の言語で描き直す（破棄した表示は描かない）", async () => {
    expect(customElements.get("maplat-ui")).toBeUndefined();
    document.body.innerHTML =
      `<maplat-ui><div id="map" lang="en"></div></maplat-ui><maplat-ui><div id="map2"></div></maplat-ui>`;
    const map = document.getElementById("map")!;
    const display = new AttributionDisplay(map, () => resolveAttributionLang(map, undefined, "ja"));
    display.update([source(GSI_ATTR)]);
    // 定義の前は仮の順（地図の要素の lang="en"）
    expect(display.element.textContent).toBe(GSI_ATTR.en);

    const map2 = document.getElementById("map2")!;
    const disposed = new AttributionDisplay(map2, () => "ja");
    disposed.update([source(GSI_ATTR)]);
    disposed.dispose();

    let renders = 0;
    const original = display.render.bind(display);
    display.render = () => {
      renders++;
      original();
    };
    customElements.define(
      "maplat-ui",
      class extends HTMLElement {
        get currentLang() {
          return "ja";
        }
      }
    );
    await flush();
    expect(display.element.textContent).toBe("国土地理院");
    expect(renders).toBe(1);
    expect(map2.querySelector(".maplat-attribution")).toBeNull();
  });
});

describe("providerAttributions（地図ごとの提供元の申告）と attributionChanged", () => {
  function setup() {
    document.body.innerHTML = `<div id="map" lang="ja"></div>`;
    const map = document.getElementById("map")!;
    const display = new AttributionDisplay(map, () => resolveAttributionLang(map));
    return { map, display };
  }
  const flush = () => new Promise(resolve => setTimeout(resolve, 0));
  function olSource(mapID: string, value: unknown, extra: Record<string, unknown> = {}) {
    return { mapID, get: () => undefined, isWmts: () => true, getAttributions: () => () => value, ...extra };
  }

  it("表示中の source ごとに、読んだ申告を狭い許可表で洗って返す（申告の無い地図・mapID の無い地図は載せない）", async () => {
    const { display } = setup();
    const base = olSource("tilejson", `<a href="https://example.org/" style="color:red">Provider</a><img src="https://example.org/x.png">`);
    const overlay = olSource("overlay", "Overlay provider");
    const configured = { ...olSource("gsi", "ignored"), get: (key: string) => (key === "attr" ? "国土地理院" : undefined) };
    const noId = olSource("", "No ID");
    display.update([base, overlay, configured, noId], [overlay]);
    display.refreshDynamic([base, overlay, configured, noId], {});
    await flush();
    expect(display.providerAttributions).toEqual([
      {
        mapID: "tilejson",
        attributions: ['<a href="https://example.org/" target="_blank" rel="noopener noreferrer">Provider</a>']
      },
      { mapID: "overlay", attributions: ["Overlay provider"] }
    ]);
  });

  it("Google の地図は attr があっても copyright を返す（attr は返さない）", async () => {
    const { display } = setup();
    const google = {
      ...olSource("gmap", "Map data ©2026 Google"),
      googleMapType: "roadmap",
      get: (key: string) => (key === "attr" ? "Configured" : undefined)
    };
    display.update([google]);
    display.refreshDynamic([google], {});
    await flush();
    expect(display.providerAttributions).toEqual([{ mapID: "gmap", attributions: ["Map data ©2026 Google"] }]);
  });

  it("地図の切り替えと申告の到着で、出典の箱から bubbles・composed の attributionChanged を出す", async () => {
    const { map, display } = setup();
    const events: Event[] = [];
    map.addEventListener("attributionChanged", event => events.push(event));
    const src = olSource("tilejson", "Provider");
    display.update([src]);
    expect(events).toHaveLength(1);
    display.refreshDynamic([src], {});
    await flush();
    expect(events).toHaveLength(2);
    expect(events[1].bubbles).toBe(true);
    expect(events[1].composed).toBe(true);
    // 同じ値の再読み取りでは出さない
    display.refreshDynamic([src], {});
    await flush();
    expect(events).toHaveLength(2);
    // 表示から外れた地図の申告は消える
    display.update([]);
    expect(display.providerAttributions).toEqual([]);
    expect(events).toHaveLength(3);
    // 破棄の後は出さない
    display.dispose();
    display.update([src]);
    expect(events).toHaveLength(3);
  });
});
