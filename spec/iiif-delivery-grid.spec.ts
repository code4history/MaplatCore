// IIIF の配信で「同じ座標に同じ画像の画素が描かれる」かを確かめる。
//
// 測るものは製品の道のものだけ:
//   - URL の関数: resolveIiifDelivery（資料を fetchImpl で返す）が返す tileUrlFunction
//   - 格子: その関数を渡して実際に HistMap_tin（noload の形）を作り、getTileGrid() から取る
//     （spec で createXYZ を組み直さない。HistMap_tin は jsdom で作れる）
//
// 格子の全ズームの全タイル（紙の外の 1 列を含む）について、次の 3 つを確かめる:
//   (i)   region: タイルの範囲を画素へ戻し（sysCoord2Xy。1e-6 で丸める）、画像の矩形で切ったものが
//                 要求の region（full は [0,0,W,H]）と一致する
//   (ii)  size:   要求の size が ceil(切った幅 / 倍率)・ceil(切った高さ / 倍率) と一致し、
//                 どちらも 256 以下（書いていない側は比べない。倍率は 2^(maxZoom - z)）
//   (iii) 欠けと余り: 画像の矩形と交わるタイルは全部 URL を返し（透明 PNG にならない）、
//                 交わらないタイルは全部透明 PNG。要求の枚数は 0 でない
//
// 期待値は仕様に書かれた文字列をそのまま写している（実装の出力を写して期待値にしない）。
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveIiifDelivery } from "../src/iiif/delivery";
import { HistMap_tin } from "../src/source/histmap_tin";
import { transPng } from "../src/const_ex";

// 画素へ戻した値は 1e-6 で丸める。丸めないと浮動小数の誤差で、紙の外の 1 列（右端が 0）を
// 「紙の中」と取り違え、ceil が 1 大きくなる（設計時の実測で正しい (b) が赤になった）。
const SCALE = 1e6;
const round6 = (value: number) => Math.round(value * SCALE) / SCALE;

const THUMBNAIL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

type Fetched = {
  ok: boolean;
  status: number;
  headers: { get: (name: string) => string | null };
  body: null;
  text: () => Promise<string>;
};

// 資料を返す fetch（ネットワークに出ない）
function jsonFetch(json: unknown, contentType = "application/json") {
  const payload = JSON.stringify(json);
  const response: Fetched = {
    ok: true,
    status: 200,
    headers: {
      get: (name: string) => {
        const key = name.toLowerCase();
        if (key === "content-type") return contentType;
        if (key === "content-length") return String(payload.length);
        return null;
      }
    },
    body: null,
    text: () => Promise.resolve(payload)
  };
  return (() => Promise.resolve(response)) as unknown as typeof fetch;
}

function readFixture(name: string) {
  return JSON.parse(
    readFileSync(resolve(__dirname, "fixtures/iiif", name), "utf-8")
  );
}

type Measured = {
  info: any;
  baseUrl: string;
  source: any;
  grid: any;
};

// 製品の道: 資料で配信を解決し、その tileUrlFunction で HistMap_tin（noload の形）を作る
//
// mapID は渡さない。今の HistMap は mapID があると tiles/<mapID>/… の url を補い
// （addCommonOptions）、OL の UrlTile は url があると渡した tileUrlFunction を作り直す
// （UrlTile の generateTileUrlFunction_）。IIIF の道は url を持たないので、格子を見るこの試験も
// mapID を渡さない。結線（source_ex）の段で、url を補わせない扱いを入れる。
async function buildSource(name: string): Promise<Measured> {
  const info = readFixture(name);
  const baseUrl = info["@id"] || info.id;
  const delivery = await resolveIiifDelivery(
    { type: "iiifImage", url: baseUrl },
    { width: info.width, height: info.height },
    { fetchImpl: jsonFetch(info) }
  );
  const source: any = new HistMap_tin({
    width: delivery.width,
    height: delivery.height,
    tileUrlFunction: delivery.tileUrlFunction,
    thumbnail: THUMBNAIL
  });
  return { info, baseUrl, source, grid: source.getTileGrid() };
}

type Request = {
  coord: number[];
  raw: string;
  region: number[];
  size: string;
};

// 要求の URL から region と size を取り出す（末尾から region/size/rotation/quality.format）
function parseRequest(url: string, width: number, height: number): Request | string {
  const parts = url.split("/");
  parts.pop(); // quality.format
  parts.pop(); // rotation
  const sizeParam = parts.pop();
  const regionParam = parts.pop();
  if (sizeParam === undefined || regionParam === undefined)
    return `URL の形が想定と違う: ${url}`;
  let region: number[];
  if (regionParam === "full") region = [0, 0, width, height];
  else if (regionParam.startsWith("pct:"))
    return `region が百分率になっている: ${url}`;
  else region = regionParam.split(",").map(Number);
  if (region.length !== 4 || region.some(v => Number.isNaN(v)))
    return `region が数値 4 つでない: ${url}`;
  return { coord: [], raw: url, region, size: sizeParam };
}

// size の書き方は版と supports で変わる。書いていない側は比べない。
function parseSize(size: string): { width?: number; height?: number } | string {
  if (size.endsWith(",")) {
    const width = Number(size.slice(0, -1));
    return Number.isNaN(width) ? `size の形が想定と違う: ${size}` : { width };
  }
  if (size.startsWith(",")) {
    const height = Number(size.slice(1));
    return Number.isNaN(height) ? `size の形が想定と違う: ${size}` : { height };
  }
  const [width, height] = size.split(",").map(Number);
  if (Number.isNaN(width) || Number.isNaN(height))
    return `size の形が想定と違う: ${size}`;
  return { width, height };
}

const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;

// 格子の全タイルに (i)(ii)(iii) を当て、不一致を文字列で返す
function measure(measured: Measured) {
  const { info, source, grid } = measured;
  const width: number = info.width;
  const height: number = info.height;
  const maxZoom: number = grid.getMaxZoom();
  const problems: string[] = [];
  let requested = 0;

  for (let z = 0; z <= maxZoom; z++) {
    // Maplat の格子の、z でのタイル 1 枚が覆う画素数
    const span = 256 * Math.pow(2, maxZoom - z);
    const nx = Math.ceil(width / span);
    const ny = Math.ceil(height / span);
    // 紙の外の 1 列（-1 と、右端・下端の 1 つ先）まで見る
    for (let x = -1; x <= nx; x++) {
      for (let y = -1; y <= ny; y++) {
        const coord = [z, x, y];
        const label = `(${z}, ${x}, ${y})`;
        const extent = grid.getTileCoordExtent(coord);
        // タイルの範囲（Maplat の sys 座標）を画素へ戻す。製品の式（sysCoord2Xy）を使う
        const [px0, py0] = source.sysCoord2Xy([extent[0], extent[3]]);
        const [px1, py1] = source.sysCoord2Xy([extent[2], extent[1]]);
        const x0 = round6(px0);
        const y0 = round6(py0);
        const x1 = round6(px1);
        const y1 = round6(py1);
        // 画像の矩形で切る
        const cx0 = Math.max(0, x0);
        const cy0 = Math.max(0, y0);
        const cx1 = Math.min(width, x1);
        const cy1 = Math.min(height, y1);
        const intersects = cx1 > cx0 && cy1 > cy0;

        // tileUrlFunction は HistMap から (coord, pixelRatio, projection) で呼ばれる
        const url: unknown = source.tileUrlFunction(coord, 1, null);

        if (!intersects) {
          if (url !== transPng)
            problems.push(
              `${label}: 紙の外なのに透明 PNG でない: ${String(url)}`
            );
          continue;
        }

        if (typeof url !== "string" || url === transPng || !url) {
          problems.push(`${label}: 紙の中なのに URL を返さない: ${String(url)}`);
          continue;
        }
        requested++;

        const parsed = parseRequest(url, width, height);
        if (typeof parsed === "string") {
          problems.push(`${label}: ${parsed}`);
          continue;
        }

        // (i) region
        const expectedRegion = [cx0, cy0, cx1 - cx0, cy1 - cy0];
        if (!expectedRegion.every((v, i) => near(v, parsed.region[i])))
          problems.push(
            `${label}: region が違う: 期待 ${expectedRegion.join(",")} 実際 ${parsed.region.join(",")} (${url})`
          );

        // (ii) size
        const scale = Math.pow(2, maxZoom - z);
        const expectedWidth = Math.ceil((cx1 - cx0) / scale);
        const expectedHeight = Math.ceil((cy1 - cy0) / scale);
        const size = parseSize(parsed.size);
        if (typeof size === "string") {
          problems.push(`${label}: ${size}`);
        } else {
          if (size.width !== undefined && size.width !== expectedWidth)
            problems.push(
              `${label}: size の幅が違う: 期待 ${expectedWidth} 実際 ${size.width} (${url})`
            );
          if (size.height !== undefined && size.height !== expectedHeight)
            problems.push(
              `${label}: size の高さが違う: 期待 ${expectedHeight} 実際 ${size.height} (${url})`
            );
          if (
            (size.width !== undefined && size.width > 256) ||
            (size.height !== undefined && size.height > 256)
          )
            problems.push(`${label}: size が 256 を超えている: ${parsed.size}`);
        }
      }
    }
  }
  return { problems, requested, maxZoom };
}

describe("同じ座標に同じ画像の画素が描かれる", () => {
  const cases: [string, string][] = [
    ["NDL 948741（v2 level1・1024）", "ndl-948741-r1.info.json"],
    ["iiif.io gottingen（v3 level1・512）", "iiif-io-v3-gottingen.info.json"],
    ["Stanford（v2 level2・1024）", "stanford-v2-level2.info.json"],
    ["level0・256 のタイル", "level0-tiles-256.info.json"]
  ];

  for (const [label, file] of cases) {
    it(`${label}: region・size・欠けと余りの 3 つが全部一致する`, async () => {
      const measured = await buildSource(file);
      const { problems, requested, maxZoom } = measure(measured);
      // 判定の効き目を確かめるため、見たタイル数と要求数を記録に残す
      expect(maxZoom).toBeGreaterThanOrEqual(0);
      expect(requested).toBeGreaterThan(0);
      expect(problems.slice(0, 20)).toEqual([]);
      expect(problems.length).toBe(0);
    });
  }
});

describe("期待する URL が文字どおり", () => {
  const ROWS: {
    label: string;
    file: string;
    coords: number[][];
    expected: string[];
  }[] = [
    {
      label: "NDL 948741（v2・4074×2705・maxZoom 4）",
      file: "ndl-948741-r1.info.json",
      coords: [
        [4, 3, 2],
        [1, 0, 0],
        [4, 15, 10],
        [0, 0, 0]
      ],
      expected: [
        "768,512,256,256/256,/0/default.jpg",
        "0,0,2048,2048/256,/0/default.jpg",
        "3840,2560,234,145/234,/0/default.jpg",
        "full/255,/0/default.jpg"
      ]
    },
    {
      label: "NDL 948741: 紙の外は透明 PNG",
      file: "ndl-948741-r1.info.json",
      coords: [
        [4, 16, 0],
        [4, -1, 0]
      ],
      expected: [transPng, transPng]
    },
    {
      label: "gottingen（v3・4032×3024・maxZoom 4）",
      file: "iiif-io-v3-gottingen.info.json",
      coords: [
        [4, 15, 11],
        [0, 0, 0]
      ],
      expected: [
        "3840,2816,192,208/192,208/0/default.jpg",
        "full/252,189/0/default.jpg"
      ]
    },
    {
      label: "Stanford（v2 level2・5426×3820・maxZoom 5）",
      file: "stanford-v2-level2.info.json",
      coords: [
        [5, 0, 0],
        [5, 21, 14],
        [0, 0, 0]
      ],
      expected: [
        "0,0,256,256/256,/0/default.jpg",
        "5376,3584,50,236/50,/0/default.jpg",
        "full/170,/0/default.jpg"
      ]
    }
  ];

  for (const row of ROWS) {
    it(row.label, async () => {
      const { source, baseUrl } = await buildSource(row.file);
      const actual = row.coords.map(coord =>
        String(source.tileUrlFunction(coord, 1, null))
      );
      const expected = row.expected.map(value =>
        value === transPng ? transPng : `${baseUrl}/${value}`
      );
      expect(actual).toEqual(expected);
    });
  }
});
