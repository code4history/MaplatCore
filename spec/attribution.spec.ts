// 表示中の現代の地図の出典の表示（src/attribution.ts）の単体試験。
import { afterEach, describe, expect, it } from "vitest";
import {
  AttributionDisplay,
  attributionTexts,
  closestLang,
  displayedAttributionSources,
  normalizeAttributionLang,
  normalizeOlAttributions,
  pickAttributionText,
  resolveAttributionLang
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
