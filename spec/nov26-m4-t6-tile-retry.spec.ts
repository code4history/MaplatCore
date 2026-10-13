// nov26-m4-t6（MaplatCore #110）: タイル合成用の tileLoadFunction（setupTileLoadFunction）で、
// onload 内の例外（getContext("2d") が null・drawImage の失敗など）で ERROR になったタイルだけを、
// 回数上限つき（3 回・遅延 1／2／4 秒）で読み直させることを固定する。
// 変更前は例外由来の失敗も 404（0×0）と同じ扱いで ERROR のまま残り、回復後もパン・ズームしない限り空白だった。
// 土台は spec/oct26-m2-t5-tile-load-exception.spec.ts の makeHarness・fireLoad（既存のファイルは変えない）。
// 違い: タイルの殻が状態（getState）と OL の ImageTile.load() 相当（load）を持ち、source の殻が getMap を持つ。
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setupTileLoadFunction } from "../src/source/mixin";

const LOADING = 1;
const ERROR = 3;

type Harness = {
  load: (tile: any) => void;
  tileLoadFn: ReturnType<typeof vi.fn>;
  images: HTMLImageElement[];
  targetEl: HTMLDivElement;
};

// OL の TileImage ソースの代わり。setTileLoadFunction で設定された関数を取り出す。
// mercatorXShift / mercatorYShift は既定 0（1 タイル = 1 片）。
// shareImagesWith を渡すと、<img> の捕捉はその harness のものを共有する（createElement を二重に差し替えない）
function makeHarness(shift: { x?: number; y?: number } = {}, shareImagesWith?: Harness): Harness {
  const tileLoadFn = vi.fn();
  let installed: any;
  const targetEl = document.createElement("div");
  document.body.appendChild(targetEl);
  const target: any = {
    mercatorXShift: shift.x || 0,
    mercatorYShift: shift.y || 0,
    tilePixelRatio_: 1,
    projection_: undefined,
    getTileLoadFunction: () => tileLoadFn,
    setTileLoadFunction: (fn: any) => {
      installed = fn;
    },
    tileUrlFunction: (coord: number[]) => `https://example.invalid/${coord.join("/")}.png`,
    // 地図の殻（破棄の判定は target 要素が DOM に繋がっているかで行う）
    getMap: () => ({ getTargetElement: () => targetEl })
  };
  setupTileLoadFunction(target);

  if (shareImagesWith) {
    return { load: (tile: any) => installed(tile, "unused"), tileLoadFn, images: shareImagesWith.images, targetEl };
  }

  // tImageLoader が作る <img> を捕まえる（jsdom は画像を読まないので onload は手で発火する）
  const images: HTMLImageElement[] = [];
  const origCreate = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation(((tag: string, opts?: any) => {
    const el = origCreate(tag, opts);
    if (tag === "img") images.push(el as HTMLImageElement);
    return el;
  }) as any);

  return { load: (tile: any) => installed(tile, "unused"), tileLoadFn, images, targetEl };
}

// 状態を持つタイルの殻。handleImageError_ で ERROR、load（OL の ImageTile.load() 相当）で
// LOADING に戻して tileLoadFunction を呼び直す。
function makeTile(h: Harness, coord: number[] = [3, 1, 2]) {
  const image = { crossOrigin: "Anonymous" } as any;
  let state = LOADING;
  const tile: any = {
    tileCoord: coord,
    getState: () => state,
    handleImageError_: vi.fn(() => {
      state = ERROR;
    }),
    load: vi.fn(() => {
      state = LOADING;
      h.load(tile);
    }),
    getImage: () => image
  };
  return tile;
}

function fireLoad(img: HTMLImageElement, w: number, h: number) {
  Object.defineProperty(img, "width", { configurable: true, get: () => w });
  Object.defineProperty(img, "height", { configurable: true, get: () => h });
  try {
    (img.onload as any)();
  } catch (_e) {
    // ブラウザではイベントハンドラ内の例外は呼出元へ伝わらない
  }
}

// 偽の時計の下で Promise の連鎖（Promise.all → then / catch）を流し切る
async function settle() {
  for (let i = 0; i < 10; i++) await vi.advanceTimersByTimeAsync(0);
}

// ms だけ時計を進め、その間に読み直しで新しく作られた <img> があれば、例外になる大きさ（256×256）で発火させる
async function advanceAndFire(h: Harness, ms: number, seen: { n: number }) {
  await vi.advanceTimersByTimeAsync(ms);
  while (seen.n < h.images.length) {
    fireLoad(h.images[seen.n], 256, 256);
    seen.n++;
  }
  await settle();
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("nov26-m4-t6 setupTileLoadFunction: 例外で ERROR になったタイルの再読込（#110）", () => {
  it("AC1（単体）: 例外の後に回復すれば、1 秒後の読み直しで tileLoadFn が呼ばれる", async () => {
    const drawImage = vi.fn();
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValueOnce(null as any)
      .mockReturnValue({ drawImage } as any);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,AAAA");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = makeHarness();
    const tile = makeTile(h);
    h.load(tile);
    fireLoad(h.images[0], 256, 256);
    await settle();
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    expect(tile.getState()).toBe(ERROR);

    const seen = { n: 1 };
    await advanceAndFire(h, 1000, seen);
    expect(tile.load).toHaveBeenCalledTimes(1);
    expect(getContext).toHaveBeenCalledTimes(2);
    expect(h.tileLoadFn).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).toHaveBeenCalledWith(tile, "data:image/png;base64,AAAA");
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
  });

  it("AC2: 例外が続くと再試行は 3 回（1／2／4 秒）で止まり、ERROR のまま", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as any);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = makeHarness();
    const tile = makeTile(h);
    h.load(tile);
    fireLoad(h.images[0], 256, 256);
    await settle();
    const seen = { n: 1 };

    // 遅延の刻みを確かめる: 999ms では読み直さない
    await advanceAndFire(h, 999, seen);
    expect(tile.load).toHaveBeenCalledTimes(0);
    await advanceAndFire(h, 1, seen);
    expect(tile.load).toHaveBeenCalledTimes(1);
    await advanceAndFire(h, 1999, seen);
    expect(tile.load).toHaveBeenCalledTimes(1);
    await advanceAndFire(h, 1, seen);
    expect(tile.load).toHaveBeenCalledTimes(2);
    await advanceAndFire(h, 3999, seen);
    expect(tile.load).toHaveBeenCalledTimes(2);
    await advanceAndFire(h, 1, seen);
    expect(tile.load).toHaveBeenCalledTimes(3);
    // 4 回目は起きない
    await advanceAndFire(h, 8000, seen);
    await advanceAndFire(h, 30000, seen);

    expect(tile.load).toHaveBeenCalledTimes(3);
    expect(tile.handleImageError_).toHaveBeenCalledTimes(4);
    expect(tile.getState()).toBe(ERROR);
    expect(h.tileLoadFn).not.toHaveBeenCalled();
  });

  it("AC3: 0×0 画像（読込失敗）のタイルは再試行しない", async () => {
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage } as any);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = makeHarness();
    const tile = makeTile(h);
    h.load(tile);
    fireLoad(h.images[0], 0, 0);
    await settle();
    await vi.advanceTimersByTimeAsync(10000);
    await settle();
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    expect(tile.load).toHaveBeenCalledTimes(0);
    expect(warn).not.toHaveBeenCalled();
  });

  it("AC4: 4 片のうち 1 片だけが例外なら、残りの片で合成して tileLoadFn を呼び、再試行しない", async () => {
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValueOnce(null as any)
      .mockReturnValue({ drawImage } as any);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,BBBB");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    // zoom 3 で 128px 相当ずれる shift（MERC_MAX = 20037508.342789244）→ 4 片
    const h = makeHarness({ x: 20037508.342789244 / 8, y: -20037508.342789244 / 8 });
    const tile = makeTile(h);
    h.load(tile);
    expect(h.images.length).toBe(4);
    h.images.forEach(img => fireLoad(img, 256, 256));
    await settle();
    await vi.advanceTimersByTimeAsync(10000);
    await settle();
    expect(drawImage).toHaveBeenCalledTimes(3);
    expect(h.tileLoadFn).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).toHaveBeenCalledWith(tile, "data:image/png;base64,BBBB");
    expect(tile.handleImageError_).toHaveBeenCalledTimes(0);
    expect(tile.load).toHaveBeenCalledTimes(0);
  });

  it("AC5: 30 枚が例外で失敗しても、記録（console.warn）は source ごとに 1 回", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as any);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = makeHarness();
    const tiles = Array.from({ length: 30 }, (_, i) => makeTile(h, [3, i, 2]));
    tiles.forEach(t => h.load(t));
    expect(h.images.length).toBe(30);
    h.images.forEach(img => fireLoad(img, 256, 256));
    await settle();
    tiles.forEach(t => expect(t.handleImageError_).toHaveBeenCalledTimes(1));
    // 再試行の失敗が重なっても増えない
    const seen = { n: 30 };
    await advanceAndFire(h, 1000, seen);
    await advanceAndFire(h, 2000, seen);
    await advanceAndFire(h, 4000, seen);
    tiles.forEach(t => expect(t.load).toHaveBeenCalledTimes(3));
    expect(warn).toHaveBeenCalledTimes(1);

    // 別の source は別に 1 回記録する
    const h2 = makeHarness({}, h);
    const t2 = makeTile(h2);
    h2.load(t2);
    fireLoad(h2.images[h2.images.length - 1], 256, 256);
    await settle();
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("AC6: 破棄した地図（target 要素が DOM から外れた）のタイルは読み直さない", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as any);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = makeHarness();
    const tile = makeTile(h);
    h.load(tile);
    fireLoad(h.images[0], 256, 256);
    await settle();
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    h.targetEl.remove();
    await vi.advanceTimersByTimeAsync(10000);
    await settle();
    expect(tile.load).toHaveBeenCalledTimes(0);
  });

  it("R-t6-2: 発火までにタイルが ERROR でなくなっていれば（読み直し済み等）何もしない", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as any);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = makeHarness();
    const tile = makeTile(h);
    h.load(tile);
    fireLoad(h.images[0], 256, 256);
    await settle();
    // 再試行の発火前に、別の経路で LOADING へ戻った体にする
    const base = tile.getState;
    tile.getState = () => LOADING;
    await vi.advanceTimersByTimeAsync(10000);
    await settle();
    expect(tile.load).toHaveBeenCalledTimes(0);
    tile.getState = base;
  });

  it("toDataURL の例外（.catch 経路）も例外由来として再試行する", async () => {
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage } as any);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL")
      .mockImplementationOnce(() => {
        throw new Error("injected toDataURL failure");
      })
      .mockReturnValue("data:image/png;base64,CCCC");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = makeHarness();
    const tile = makeTile(h);
    h.load(tile);
    fireLoad(h.images[0], 256, 256);
    await settle();
    expect(tile.handleImageError_).toHaveBeenCalledTimes(1);
    const seen = { n: 1 };
    await advanceAndFire(h, 1000, seen);
    expect(tile.load).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).toHaveBeenCalledTimes(1);
    expect(h.tileLoadFn).toHaveBeenCalledWith(tile, "data:image/png;base64,CCCC");
  });
});
