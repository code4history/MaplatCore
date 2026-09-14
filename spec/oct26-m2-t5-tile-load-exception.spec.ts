// oct26-m2-t5（MaplatCore #109）: タイル合成用の tileLoadFunction（setupTileLoadFunction）で、
// 元画像の onload 内（getContext("2d") → drawImage）が例外を投げても、そのタイルが必ず決着することを固定する。
// 変更前は例外で resolve が飛ばされ、Promise.all が保留 → tileLoadFn も handleImageError_ も呼ばれず、
// OL の ImageTile が LOADING のまま残って TileQueue（上限 16）が詰まっていた。
// AC3: 例外時は handleImageError_ が 1 回呼ばれ、tileLoadFn は呼ばれない。
// AC4: 正常系（描画成功 → tileLoadFn）と画像 0×0（読込失敗 → handleImageError_）は現行どおり。
import { afterEach, describe, expect, it, vi } from "vitest";
import { setupTileLoadFunction } from "../src/source/mixin";

type Harness = {
  load: (tile: any) => void;
  tileLoadFn: ReturnType<typeof vi.fn>;
  images: HTMLImageElement[];
};

// OL の TileImage ソースの代わり。setTileLoadFunction で設定された関数を取り出す。
// mercatorXShift / mercatorYShift は既定 0（1 タイル = 1 片）。
function makeHarness(shift: { x?: number; y?: number } = {}): Harness {
  const tileLoadFn = vi.fn();
  let installed: any;
  const target: any = {
    mercatorXShift: shift.x || 0,
    mercatorYShift: shift.y || 0,
    tilePixelRatio_: 1,
    projection_: undefined,
    getTileLoadFunction: () => tileLoadFn,
    setTileLoadFunction: (fn: any) => {
      installed = fn;
    },
    tileUrlFunction: (coord: number[]) => `https://example.invalid/${coord.join("/")}.png`
  };
  setupTileLoadFunction(target);

  // tImageLoader が作る <img> を捕まえる（jsdom は画像を読まないので onload は手で発火する）
  const images: HTMLImageElement[] = [];
  const origCreate = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation(((tag: string, opts?: any) => {
    const el = origCreate(tag, opts);
    if (tag === "img") images.push(el as HTMLImageElement);
    return el;
  }) as any);

  return { load: (tile: any) => installed(tile, "unused"), tileLoadFn, images };
}

function makeTile() {
  const image = { crossOrigin: "Anonymous" } as any;
  return {
    tileCoord: [3, 1, 2],
    handleImageError_: vi.fn(),
    getImage: () => image
  };
}

function fireLoad(img: HTMLImageElement, w: number, h: number) {
  Object.defineProperty(img, "width", { configurable: true, get: () => w });
  Object.defineProperty(img, "height", { configurable: true, get: () => h });
  // ブラウザではイベントハンドラ内の例外は呼出元へ伝わらず報告されるだけなので、同じく飲み込む。
  // 判定はあくまで「タイルが決着したか」（handleImageError_ / tileLoadFn の呼出）で行う。
  try {
    (img.onload as any)();
  } catch (_e) {
    // no-op
  }
}

// Promise の連鎖（Promise.all → then / catch）が流れ切るのを待つ
async function settle() {
  for (let i = 0; i < 10; i++) await new Promise(r => setTimeout(r, 0));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("oct26-m2-t5 setupTileLoadFunction: onload 内の例外でタイルが決着しない問題（#109）", () => {
  it("AC3: getContext('2d') が null（drawImage で TypeError）でも handleImageError_ が 1 回呼ばれる", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as any);
    const h = makeHarness();
    const tile = makeTile();
    h.load(tile);
    expect(h.images.length).toBe(1);
    fireLoad(h.images[0], 256, 256);
    await settle();
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).not.toHaveBeenCalled();
  });

  it("AC3: drawImage 自体が例外を投げても handleImageError_ が 1 回呼ばれる", async () => {
    const drawImage = vi.fn(() => {
      throw new Error("injected drawImage failure");
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage } as any);
    const h = makeHarness();
    const tile = makeTile();
    h.load(tile);
    fireLoad(h.images[0], 256, 256);
    await settle();
    expect(drawImage).toHaveBeenCalledTimes(1);
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).not.toHaveBeenCalled();
  });

  it("AC3: 複数片（mercatorShift あり）の全片で例外 → handleImageError_ が 1 回呼ばれる", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as any);
    // zoom 3 で 128px 相当ずれる shift（MERC_MAX = 20037508.342789244）
    const h = makeHarness({ x: 20037508.342789244 / 8, y: -20037508.342789244 / 8 });
    const tile = makeTile();
    h.load(tile);
    expect(h.images.length).toBe(4);
    h.images.forEach(img => fireLoad(img, 256, 256));
    await settle();
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).not.toHaveBeenCalled();
  });

  it("AC4（回帰）: 描画が成功すれば tileLoadFn(tile, dataUrl) が呼ばれ、handleImageError_ は呼ばれない", async () => {
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage } as any);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,AAAA");
    const h = makeHarness();
    const tile = makeTile();
    h.load(tile);
    fireLoad(h.images[0], 256, 256);
    await settle();
    expect(drawImage).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).toHaveBeenCalledWith(tile, "data:image/png;base64,AAAA");
    expect(tile.handleImageError_).not.toHaveBeenCalled();
  });

  it("AC4（回帰）: 画像が 0×0（読込失敗）なら handleImageError_ が 1 回呼ばれる", async () => {
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage } as any);
    const h = makeHarness();
    const tile = makeTile();
    h.load(tile);
    fireLoad(h.images[0], 0, 0);
    await settle();
    expect(drawImage).not.toHaveBeenCalled();
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).not.toHaveBeenCalled();
  });
});
