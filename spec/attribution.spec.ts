// 表示中の現代の地図の出典の表示（src/attribution.ts）の単体試験。
import { afterEach, describe, expect, it } from "vitest";
import {
  AttributionDisplay,
  attributionTexts,
  closestLang,
  displayedAttributionSources,
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
  it("地域つきの言語は地域を外した言語にも当てる", () => {
    expect(pickAttributionText(GSI_ATTR, "ja-JP")).toBe("国土地理院");
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
  it("lang 属性が無ければ appOption.lang → 設定ファイルの lang → ブラウザ → en", () => {
    document.body.innerHTML = `<div id="map"></div>`;
    const map = document.getElementById("map");
    expect(resolveAttributionLang(map, "en", "ja")).toBe("en");
    expect(resolveAttributionLang(map, undefined, "ja")).toBe("ja");
    expect(resolveAttributionLang(map, 3, "")).toBe(navigator.language || "en");
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
    const display = new AttributionDisplay(map, () => resolveAttributionLang(map, undefined, "ja"));
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
