import { test, expect, type Page } from '@playwright/test';

// 範囲外の POI: 古地図の紙の外にある POI を背面の地図に立てる機能の、実ブラウザでの確かめ。
// デモの館林（?region=tatebayashi）を開き、スクリーンショットではなく層の中身を読む。
//   - 前面: app.mapObject.getSource('marker').getFeatures()
//   - 背面: app.backMap.getSource('marker').getFeatures()
// 地物の datum は POI のデータで、namespaceID が POI の id。
// タイルは読まない（座標の判定と層の中身だけを見る）。

const DEMO = '/?region=tatebayashi';
const OTHER_MAP = 'tatebayashi_ojozu';

type Datum = { namespaceID?: string; name?: unknown; lnglat?: number[]; lat?: number; lng?: number };

const openDemo = async (page: Page): Promise<void> => {
  await page.goto(DEMO, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
  await page.waitForSelector('#demo-app-controls .demo-sec', { timeout: 30000 });
  await page.waitForSelector('#outside-poi-table tbody tr', { timeout: 30000 });
  await waitLayersSettled(page);
};

// 前面と背面の marker 層の id（namespaceID）を、並びを保ったまま返す。
// 選択中の POI は各層の配列の最後に置かれるので、並びはそのまま意味を持つ。
const layerIds = (page: Page, where: 'front' | 'back'): Promise<string[]> =>
  page.evaluate((w) => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const map = w === 'back' ? app?.backMap : app?.mapObject;
    const source = map?.getSource?.('marker');
    if (!source) return [] as string[];
    return source.getFeatures().map((f: any) => String(f.get('datum')?.namespaceID ?? ''));
  }, where);

// 層の入れ替えは「全件を判定してから 1 回で置く」ので、連続したフレームで同じ中身になったら落ち着いたとみなす。
const waitLayersSettled = async (page: Page): Promise<void> => {
  await page.evaluate(async () => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const ids = (map: any): string[] => {
      const source = map?.getSource?.('marker');
      if (!source) return [];
      return source.getFeatures().map((f: any) => String(f.get('datum')?.namespaceID ?? '')).sort();
    };
    const key = () => JSON.stringify([ids(app.mapObject), ids(app.backMap)]);
    let last = key();
    let stable = 0;
    for (let i = 0; i < 600 && stable < 5; i++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const now = key();
      if (now === last) stable += 1;
      else {
        stable = 0;
        last = now;
      }
    }
  });
};

// 地図の移動（goHome・setViewpoint などのアニメーション）が止まるまで待つ。
// 固定の待ち時間は CI の負荷で足りなくなるので使わない。
const waitViewSettled = async (page: Page): Promise<void> => {
  await page.waitForFunction(
    () => {
      const view = (window as any).__MAPLAT_DEMO_APP__?.mapObject?.getView?.();
      return !!view && !view.getAnimating() && !view.getInteracting();
    },
    undefined,
    { timeout: 30000 }
  );
};

// デモの操作パネルのボタンを押す（同じ名前のボタンは節の中に 1 つだけ置く）。
const pressButton = async (page: Page, name: string): Promise<void> => {
  await page.getByRole('button', { name, exact: true }).click();
  await waitViewSettled(page);
  await waitLayersSettled(page);
};

test.describe('範囲外の POI の層', () => {
  test('範囲外の POI は背面の marker 層に、範囲内は前面の marker 層に描かれる', async ({ page }) => {
    await openDemo(page);
    const front = await layerIds(page, 'front');
    const back = await layerIds(page, 'back');
    // 館林の素材は範囲内と範囲外の両方を持つ（足りない分はデモが紙の外の点を足す）
    expect(front.length).toBeGreaterThan(0);
    expect(back.length).toBeGreaterThan(0);
    // 同じ POI を前面と背面の両方に描かない
    for (const id of back) expect(front).not.toContain(id);

    // 背面の地物はメルカトルの座標で置かれ、古地図の紙の外にある
    const backOutside = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const source = app.backMap.getSource('marker');
      const results: boolean[] = [];
      for (const f of source.getFeatures()) {
        const merc = f.getGeometry().getCoordinates();
        const xy = await app.from.merc2SysCoordAsync_ignoreBackground(merc);
        // 写せない（undefined）か、写せても紙の外なら範囲外
        results.push(!xy || !app.from.insideCheckSysCoord(xy));
      }
      return results;
    });
    expect(backOutside.every(Boolean)).toBe(true);

    // 前面の地物は紙の中（古地図の座標のまま）
    const frontInside = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const source = app.mapObject.getSource('marker');
      return source.getFeatures().map((f: any) =>
        app.from.insideCheckSysCoord(f.getGeometry().getCoordinates())
      );
    });
    expect(frontInside.every(Boolean)).toBe(true);
  });

  test('hide-outside-pois で背面の層が空になり、戻すと元に戻る', async ({ page }) => {
    await openDemo(page);
    const frontBefore = await layerIds(page, 'front');
    const backBefore = await layerIds(page, 'back');
    expect(backBefore.length).toBeGreaterThan(0);

    await pressButton(page, 'hide-outside-pois');
    expect(await layerIds(page, 'back')).toEqual([]);
    // 範囲内の POI は消えない
    expect(await layerIds(page, 'front')).toEqual(frontBefore);

    await pressButton(page, '範囲外を出す（既定）');
    expect((await layerIds(page, 'back')).sort()).toEqual([...backBefore].sort());
  });
});

test.describe('地図を切り替える間の層', () => {
  test('どのフレームの（前面の数, 背面の数）も、切り替え前か切り替え後の組に一致する', async ({ page }) => {
    await openDemo(page);
    const frames = await page.evaluate(async (to) => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const counts = (): [number, number] => [
        app.mapObject.getSource('marker')?.getFeatures().length ?? 0,
        app.backMap?.getSource?.('marker')?.getFeatures().length ?? 0
      ];
      const seen: [number, number][] = [];
      let stop = false;
      const tick = (): void => {
        seen.push(counts());
        if (!stop) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      // 記録を始めたフレームを 1 つ進めてから切り替える
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await app.changeMap(to);
      // 描き直しが終わるまで、中身が 5 フレーム続けて同じになるのを待つ
      let last = '';
      let stable = 0;
      for (let i = 0; i < 600 && stable < 5; i++) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const now = counts().join(',');
        if (now === last) stable += 1;
        else {
          stable = 0;
          last = now;
        }
      }
      stop = true;
      return seen;
    }, OTHER_MAP);

    expect(frames.length).toBeGreaterThan(2);
    const before = frames[0].join(',');
    const after = frames[frames.length - 1].join(',');
    // 途中の組（片方だけ空・二重になっている組）が 1 フレームも無いこと。
    // 切り替え先で範囲外が 0 件になり背面が空になるのは正しい結果なので、片方だけ空そのものは禁じない
    for (const frame of frames) {
      expect([before, after], `途中のフレーム ${frame.join(',')}`).toContain(frame.join(','));
    }
  });
});

// クリックの結果を控える（デモは clickMarker・clickMap を DOM イベントで出しているが、
// ここでは最後に届いたイベントの detail を読む）。
const watchClicks = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const w = window as any;
    w.__LAST_CLICK_MARKER__ = undefined;
    w.__LAST_CLICK_MAP__ = undefined;
    app.addEventListener('clickMarker', (e: any) => {
      w.__LAST_CLICK_MARKER__ = e.detail;
    });
    app.addEventListener('clickMap', (e: any) => {
      w.__LAST_CLICK_MAP__ = e.detail;
    });
  });
};

const takeClicks = (page: Page): Promise<{ marker?: Datum; map?: unknown }> =>
  page.evaluate(() => ({
    marker: (window as any).__LAST_CLICK_MARKER__,
    map: (window as any).__LAST_CLICK_MAP__
  }));

// ピンは下端が地点（anchor の y が 1）。画像は 24×48 で、頭の丸の中心（地点の 36 px 上）を押す。
const PIN_HEAD = 36;
// 画面の端からこれだけ内側にあるピンだけを使う（端のピンは押せない・見えない）。
const MARGIN = 40;

// 古地図を半段ずつ引いて、紙の外の背面のピンが画面の中（押す点も紙の外）に来るまで待つ。
// 見つかったピンを返す（最大 4 回。見つからなければ null）。
const revealOutsideBackPin = async (page: Page) => {
  for (let step = 0; step < 4; step++) {
    const found = await findOutsideBackPin(page);
    if (found) return found;
    await page.evaluate(() => {
      const view = (window as any).__MAPLAT_DEMO_APP__.mapObject.getView();
      view.setZoom(view.getZoom() - 0.5);
    });
    await waitViewSettled(page);
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    );
  }
  return findOutsideBackPin(page);
};

// 紙の外にある背面のピンのうち、画面の中に見えていて、押す点も紙の外で、前面のピンと重ならないものを 1 つ返す。
// 座標はページの座標（mouse.click にそのまま渡せる）。
const findOutsideBackPin = (page: Page) =>
  page.evaluate(
    ({ head, margin }) => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const source = app.backMap?.getSource?.('marker');
      if (!source) return null;
      const rect = app.backMap.getViewport().getBoundingClientRect();
      for (const f of source.getFeatures()) {
        const [x, y] = app.backMap.getPixelFromCoordinate(f.getGeometry().getCoordinates());
        const pixel: [number, number] = [x, y - head];
        if (!(pixel[0] > margin && pixel[0] < rect.width - margin && pixel[1] > margin && pixel[1] < rect.height - margin)) continue;
        const coordinate = app.mapObject.getCoordinateFromPixel(pixel);
        if (!coordinate || app.from.insideCheckSysCoord(coordinate)) continue;
        if (app.mapObject.getFeaturesAtPixel(pixel).length > 0) continue;
        return { id: String(f.get('datum')?.namespaceID ?? ''), x: rect.left + pixel[0], y: rect.top + pixel[1] };
      }
      return null;
    },
    { head: PIN_HEAD, margin: MARGIN }
  );

// 紙が覆っている背面のピンを作る。画面を縦に走査して紙の下の縁を探し、そのすぐ下（紙の外）に POI を足す。
// ピンは地点から上へ伸びるので、頭は紙の上に掛かる（紙に覆われた背面のピン）。押す点（頭）が紙の中で、
// そこに背面のピンが当たることまで確かめてから返す。
const makeCoveredBackPin = async (page: Page) => {
  // 前の操作で選んだ POI があれば外す（デモはクリックで POI を選び、中心を寄せる）
  await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.unselectMarker());
  await waitViewSettled(page);
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  );
  const added = await page.evaluate((head) => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const rect = app.mapObject.getViewport().getBoundingClientRect();
    const insideAt = (x: number, y: number): boolean => {
      const c = app.mapObject.getCoordinateFromPixel([x, y]);
      return !!c && !!app.from.insideCheckSysCoord(c);
    };
    // 画面の中を縦に走査して、上が紙・下が紙の外になる縁（紙の下の縁）を探す。
    // ピンの頭（縁より上）と地点（縁より下）が両方とも画面の中に入る所だけを使う
    let x = -1;
    let y = -1;
    for (let cx = 60; cx < rect.width - 60 && x < 0; cx += 20) {
      for (let cy = head + 20; cy < rect.height - head; cy += 1) {
        if (insideAt(cx, cy) && !insideAt(cx, cy + 1) && !insideAt(cx, cy + Math.round(head / 2))) {
          x = cx;
          y = cy + 1;
          break;
        }
      }
    }
    if (x < 0) return null;
    // 紙の縁から少し下（頭が紙に掛かる距離）。押す点は縁より上になる
    const tipY = y + Math.round(head / 2);
    const merc = app.backMap.getCoordinateFromPixel([x, tipY]);
    const lnglat = (window as any).ol?.proj?.toLonLat
      ? (window as any).ol.proj.toLonLat(merc)
      : [
          (merc[0] / 20037508.342789244) * 180,
          (Math.atan(Math.exp((merc[1] / 20037508.342789244) * Math.PI)) * 360) / Math.PI - 90
        ];
    app.addPoiLayer('covered-pin', { name: '紙に覆われたピン' });
    const id = app.addMarker({ name: '紙に覆われたピン', lnglat }, 'covered-pin');
    return { id: String(id), x, y: tipY - head, rectLeft: rect.left, rectTop: rect.top };
  }, PIN_HEAD);
  if (!added) return null;
  // 足した POI が前面か背面の層に入り、描かれるまで待つ（判定は非同期）
  await page.waitForFunction(
    (id) => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const has = (map: any): boolean =>
        !!map?.getSource?.('marker')
          ?.getFeatures()
          .some((f: any) => String(f.get('datum')?.namespaceID ?? '') === id);
      return has(app.backMap) || has(app.mapObject);
    },
    added.id,
    { timeout: 30000 }
  );
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  );
  // 押す点は、描かれたピンの実際の位置（地点の画素）から決め直す（背面は前面の描画に遅れて追従する）
  const ok = await page.evaluate(
    ({ id, head }) => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const feature = app.backMap
        .getSource('marker')
        .getFeatures()
        .find((f: any) => String(f.get('datum')?.namespaceID ?? '') === id);
      const rect = app.mapObject.getViewport().getBoundingClientRect();
      if (!feature) return { inBack: false, onPaper: false, hit: false, front: 0, pageX: 0, pageY: 0 };
      const tip = app.backMap.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
      const pixel = [tip[0], tip[1] - head];
      const coordinate = app.mapObject.getCoordinateFromPixel(pixel);
      const hits: string[] = [];
      app.backMap.forEachFeatureAtPixel(pixel, (f: any) => {
        hits.push(String(f.get('datum')?.namespaceID ?? ''));
      });
      return {
        inBack: true,
        // ピンの頭は紙の上、地点は紙の外（紙に覆われたピン）
        onPaper:
          !!app.from.insideCheckSysCoord(coordinate) &&
          !app.from.insideCheckSysCoord(app.mapObject.getCoordinateFromPixel(tip)),
        hit: hits.includes(id),
        front: app.mapObject.getFeaturesAtPixel(pixel).length,
        pageX: rect.left + pixel[0],
        pageY: rect.top + pixel[1]
      };
    },
    { id: added.id, head: PIN_HEAD }
  );
  return { id: added.id, ...ok };
};

// 前面のピン（範囲内の POI）のうち、画面の中に見えているものを 1 つ返す。
const findFrontPin = (page: Page) =>
  page.evaluate(
    ({ head, margin }) => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const source = app.mapObject?.getSource?.('marker');
      if (!source) return null;
      const rect = app.mapObject.getViewport().getBoundingClientRect();
      for (const f of source.getFeatures()) {
        const [x, y] = app.mapObject.getPixelFromCoordinate(f.getGeometry().getCoordinates());
        const pixel: [number, number] = [x, y - head];
        if (!(pixel[0] > margin && pixel[0] < rect.width - margin && pixel[1] > margin && pixel[1] < rect.height - margin)) continue;
        return { id: String(f.get('datum')?.namespaceID ?? ''), x: rect.left + pixel[0], y: rect.top + pixel[1] };
      }
      return null;
    },
    { head: PIN_HEAD, margin: MARGIN }
  );

test.describe('背面のピンを押す（マウス）', () => {
  test('紙の外の背面のピンは clickMarker、紙に覆われた背面のピンは透過度によらず clickMap、前面と重なれば前面だけ', async ({ page }) => {
    await openDemo(page);

    // 1. 紙の外の背面のピン → clickMarker（前面と同じ形で、背面の POI が返る）
    const outside = await revealOutsideBackPin(page);
    expect(outside, '画面の中に紙の外の背面のピンがありません').not.toBeNull();
    await watchClicks(page);
    await page.mouse.click(outside!.x, outside!.y);
    await waitViewSettled(page);
    const first = await takeClicks(page);
    expect(String(first.marker?.namespaceID ?? '')).toBe(outside!.id);
    expect(first.map).toBeUndefined();

    // 2. 紙に覆われた背面のピン → clickMap（透過度 0 と 70 のどちらでも押せない）
    const covered = await makeCoveredBackPin(page);
    expect(covered, '紙の下の縁が画面の中にありません').not.toBeNull();
    expect(covered!.inBack, '足した POI が背面の層にありません').toBe(true);
    expect(covered!.onPaper, 'ピンの頭が紙の上・地点が紙の外になっていません').toBe(true);
    expect(covered!.hit, '押す点に背面のピンが当たりません').toBe(true);
    expect(covered!.front).toBe(0);
    for (const transparency of [0, 70]) {
      await page.evaluate((value) => {
        (window as any).__MAPLAT_DEMO_APP__.setTransparency(value);
      }, transparency);
      await watchClicks(page);
      await page.mouse.click(covered!.pageX, covered!.pageY);
      await waitViewSettled(page);
      const clicked = await takeClicks(page);
      expect(clicked.marker, `透過度 ${transparency} で紙に覆われたピンが押せた`).toBeUndefined();
      expect(clicked.map).toBeTruthy();
    }

    // 3. 前面のピン → 前面だけ（前面で当たったら背面は見ない）
    // 前の操作で視点が動いているので、前面のピンの 1 つへ中心を合わせてから押す
    await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      app.setTransparency(0);
      const feature = app.mapObject.getSource('marker').getFeatures()[0];
      if (feature) app.mapObject.getView().setCenter(feature.getGeometry().getCoordinates());
    });
    await waitViewSettled(page);
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    );
    const front = await findFrontPin(page);
    expect(front, '画面の中に前面のピンがありません').not.toBeNull();
    await watchClicks(page);
    await page.mouse.click(front!.x, front!.y);
    await waitViewSettled(page);
    const frontClick = await takeClicks(page);
    expect(String(frontClick.marker?.namespaceID ?? '')).toBe(front!.id);
  });
});

test.describe('背面のピンを押す（タッチ）', () => {
  test.use({ hasTouch: true });

  test('紙の外の背面のピンをタップすると clickMarker、紙に覆われたピンは clickMap', async ({ page }) => {
    await openDemo(page);
    const outside = await revealOutsideBackPin(page);
    expect(outside, '画面の中に紙の外の背面のピンがありません').not.toBeNull();
    await watchClicks(page);
    await page.touchscreen.tap(outside!.x, outside!.y);
    await waitViewSettled(page);
    const clicked = await takeClicks(page);
    expect(String(clicked.marker?.namespaceID ?? '')).toBe(outside!.id);
    expect(clicked.map).toBeUndefined();

    const covered = await makeCoveredBackPin(page);
    expect(covered, '紙の下の縁が画面の中にありません').not.toBeNull();
    expect(covered!.hit, '押す点に背面のピンが当たりません').toBe(true);
    await watchClicks(page);
    await page.touchscreen.tap(covered!.pageX, covered!.pageY);
    await waitViewSettled(page);
    const tapped = await takeClicks(page);
    expect(tapped.marker).toBeUndefined();
    expect(tapped.map).toBeTruthy();
  });
});

// 範囲外の POI を選んでいる間の地図の挙動。

const watchOutOfMap = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    (window as any).__OUT_OF_MAP__ = 0;
    app.addEventListener('outOfMap', () => {
      (window as any).__OUT_OF_MAP__ += 1;
    });
  });
};

// 選択中の POI の画素（前面か背面か）と、その画素が画面の中心からどれだけ離れているか。
const selectionInfo = (page: Page) =>
  page.evaluate(() => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const id = app.__selectedMarker;
    const maps: [any, string][] = [[app.mapObject, 'front']];
    if (app.backMap) maps.push([app.backMap, 'back']);
    let where: string | undefined;
    let pixel: number[] | undefined;
    for (const [map, name] of maps) {
      const source = map?.getSource?.('marker');
      if (!source) continue;
      const feature = source.getFeatures().find((f: any) => f.get('datum')?.namespaceID === id);
      if (feature) {
        where = name;
        pixel = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
        break;
      }
    }
    const rect = app.mapObject.getViewport().getBoundingClientRect();
    return {
      id,
      merc: app.__outsideSelection?.merc,
      where,
      pixel,
      width: rect.width,
      height: rect.height
    };
  });

const selectOutsideAndCheck = async (page: Page): Promise<void> => {
  await pressButton(page, '範囲外のピンを選ぶ');
  const info = await selectionInfo(page);
  expect(info.id, '範囲外の POI が選ばれていません').toBeTruthy();
  expect(info.pixel, '選んだ POI のピンが層にありません').toBeTruthy();
  // ピンの先（地物の座標）が画面の中心から 16 px 以内
  const dx = info.pixel![0] - info.width / 2;
  const dy = info.pixel![1] - info.height / 2;
  expect(Math.hypot(dx, dy)).toBeLessThanOrEqual(16);
  // 範囲外を選んだだけで outOfMap を出さない
  expect(await page.evaluate(() => (window as any).__OUT_OF_MAP__)).toBe(0);
};

const unselectAndCheck = async (page: Page): Promise<void> => {
  // 外す前の中心を紙の内側へ寄せた点が、外した後に中心になる
  const expected = await page.evaluate(() => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const center = app.mapObject.getView().getCenter();
    return { center, expected: app.from.modulateSysCoordInside(center) };
  });
  expect(expected.expected, '引き戻し先が決まりません').toBeTruthy();
  await pressButton(page, '選択を外す');
  const after = await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.mapObject.getView().getCenter());
  expect(after[0]).toBeCloseTo(expected.expected[0], 2);
  expect(after[1]).toBeCloseTo(expected.expected[1], 2);
};

test.describe('範囲外の POI を選んでいる間（前面が古地図）', () => {
  test('選ぶとピンが中心に来て outOfMap が出ず、外すと紙の内側へ戻る', async ({ page }) => {
    await openDemo(page);
    await watchOutOfMap(page);
    // 古地図の前面では、範囲外のピンは背面の層にある
    expect((await layerIds(page, 'back')).length).toBeGreaterThan(0);
    await selectOutsideAndCheck(page);
    const info = await selectionInfo(page);
    expect(info.where).toBe('back');
    await unselectAndCheck(page);
  });
});

test.describe('範囲外の POI を選んでいる間（前面が TMS の地図）', () => {
  test('前面がメルカトルの TMS でもピンが中心に来て、外すと紙の内側へ戻る', async ({ page }) => {
    await page.goto('/e2e/fixtures/outside-pois-tms.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      () => (window as any).__MAPLAT_READY__ || (window as any).__MAPLAT_ERROR__,
      undefined,
      { timeout: 120000 }
    );
    expect(await page.evaluate(() => (window as any).__MAPLAT_ERROR__)).toBeUndefined();

    // 紙の外の POI（東京）と紙の中の POI（盛岡城）を足す
    const ids = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_APP__;
      app.addPoiLayer('tms-test', { name: '範囲外の POI' });
      return {
        outside: app.addMarker({ name: '範囲外の例', lnglat: [139.5, 35.6] }, 'tms-test'),
        inside: app.addMarker({ name: '範囲内の例', lnglat: [141.150205, 39.700125] }, 'tms-test'),
        mercator: app.from.isWmts()
      };
    });
    expect(ids.mercator).toBe(true);
    // 前面がメルカトルの地図では、範囲外のピンも前面の層に描かれる（背面には置かない）
    await page.waitForFunction(
      (outsideID) => {
        const app = (window as any).__MAPLAT_APP__;
        const has = (source: any): boolean =>
          !!source &&
          source.getFeatures().some((f: any) => String(f.get('datum')?.namespaceID ?? '') === outsideID);
        return has(app?.mapObject?.getSource?.('marker')) && !has(app?.backMap?.getSource?.('marker'));
      },
      ids.outside,
      { timeout: 30000 }
    );

    await page.evaluate(() => {
      const app = (window as any).__MAPLAT_APP__;
      (window as any).__OUT_OF_MAP__ = 0;
      app.addEventListener('outOfMap', () => {
        (window as any).__OUT_OF_MAP__ += 1;
      });
    });

    // 選ぶとピンが中心に来る（16 px 以内）。外したときに戻る先（紙の縁）もここで控える
    const measured = await page.evaluate(async (outsideID) => {
      const app = (window as any).__MAPLAT_APP__;
      const view = app.mapObject.getView();
      const settle = async (): Promise<void> => {
        let quiet = 0;
        for (let i = 0; i < 600 && quiet < 5; i++) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const busy =
            view.getAnimating() ||
            view.getInteracting() ||
            app.__outsideSelection?.pending === true;
          quiet = busy ? 0 : quiet + 1;
        }
      };
      app.selectMarker(outsideID);
      await settle();
      const feature = app.mapObject
        .getSource('marker')
        .getFeatures()
        .find((f: any) => String(f.get('datum')?.namespaceID ?? '') === outsideID);
      const pixel = feature
        ? app.mapObject.getPixelFromCoordinate(feature.getGeometry().getCoordinates())
        : null;
      const rect = app.mapObject.getViewport().getBoundingClientRect();
      return {
        pixel,
        width: rect.width,
        height: rect.height,
        outOfMap: (window as any).__OUT_OF_MAP__,
        edge: app.from.modulateSysCoordInside(view.getCenter())
      };
    }, ids.outside);

    expect(measured.pixel, '選んだ POI のピンが層にありません').toBeTruthy();
    const dx = measured.pixel![0] - measured.width / 2;
    const dy = measured.pixel![1] - measured.height / 2;
    expect(Math.hypot(dx, dy)).toBeLessThanOrEqual(16);
    expect(measured.outOfMap).toBe(0);

    // 外すと紙の内側へ戻る
    const after = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_APP__;
      const view = app.mapObject.getView();
      const settle = async (): Promise<void> => {
        let quiet = 0;
        for (let i = 0; i < 600 && quiet < 5; i++) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const busy =
            view.getAnimating() ||
            view.getInteracting() ||
            app.__outsideSelection?.pending === true;
          quiet = busy ? 0 : quiet + 1;
        }
      };
      app.unselectMarker();
      await settle();
      return view.getCenter();
    });
    expect(after[0]).toBeCloseTo(measured.edge[0], 2);
    expect(after[1]).toBeCloseTo(measured.edge[1], 2);
  });
});

test.describe('範囲外の POI を続けて選ぶ', () => {
  test('外から外へ選び直しても、中心の履歴に紙の縁が挟まらない', async ({ page }) => {
    await openDemo(page);
    const result = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const view = app.mapObject.getView();
      const idsOf = (map: any): string[] => {
        const source = map?.getSource?.('marker');
        return source
          ? source.getFeatures().map((f: any) => String(f.get('datum')?.namespaceID ?? ''))
          : [];
      };
      const outsideIds = idsOf(app.backMap);
      const settle = async (): Promise<void> => {
        let quiet = 0;
        for (let i = 0; i < 600 && quiet < 5; i++) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const busy =
            view.getAnimating() ||
            view.getInteracting() ||
            app.__outsideSelection?.pending === true;
          quiet = busy ? 0 : quiet + 1;
        }
      };
      const centers: { center: number[]; inside: boolean }[] = [];
      const record = (): void => {
        const center = view.getCenter();
        centers.push({ center, inside: !!center && !!app.from.insideCheckSysCoord(center) });
      };
      app.mapObject.on('moveend', record);
      let modCalls = 0;
      const original = app.from.modulateSysCoordInside;
      app.from.modulateSysCoordInside = function (this: any, center: number[]) {
        modCalls += 1;
        return original.call(this, center);
      };
      app.selectMarker(outsideIds[0]);
      await settle();
      app.selectMarker(outsideIds[1]);
      await settle();
      app.mapObject.un('moveend', record);
      app.from.modulateSysCoordInside = original;
      return { outsideIds, centers, modCalls };
    });

    expect(result.outsideIds.length).toBeGreaterThan(1);
    // 縁への引き戻しが 1 度も走らない
    expect(result.modCalls).toBe(0);
    expect(result.centers.length).toBeGreaterThan(0);
    // 中心の履歴に紙の内側（縁）が挟まらない
    for (const entry of result.centers) expect(entry.inside).toBe(false);
  });

  test('外から内へ選び直しても、中心の履歴に紙の縁が挟まらない', async ({ page }) => {
    await openDemo(page);
    const result = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const view = app.mapObject.getView();
      const idsOf = (map: any): string[] => {
        const source = map?.getSource?.('marker');
        return source
          ? source.getFeatures().map((f: any) => String(f.get('datum')?.namespaceID ?? ''))
          : [];
      };
      const outsideIds = idsOf(app.backMap);
      const insideIds = idsOf(app.mapObject);
      const settle = async (): Promise<void> => {
        let quiet = 0;
        for (let i = 0; i < 600 && quiet < 5; i++) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const busy =
            view.getAnimating() ||
            view.getInteracting() ||
            app.__outsideSelection?.pending === true;
          quiet = busy ? 0 : quiet + 1;
        }
      };
      app.selectMarker(outsideIds[0]);
      await settle();
      // 外したときに戻る先（紙の縁）を先に控える
      const edge = app.from.modulateSysCoordInside(view.getCenter());
      const centers: { center: number[]; inside: boolean }[] = [];
      const record = (): void => {
        const center = view.getCenter();
        centers.push({ center, inside: !!center && !!app.from.insideCheckSysCoord(center) });
      };
      app.mapObject.on('moveend', record);
      let modCalls = 0;
      const original = app.from.modulateSysCoordInside;
      app.from.modulateSysCoordInside = function (this: any, center: number[]) {
        modCalls += 1;
        return original.call(this, center);
      };
      app.selectMarker(insideIds[0]);
      await settle();
      app.mapObject.un('moveend', record);
      app.from.modulateSysCoordInside = original;
      return { outsideIds, insideIds, edge, centers, modCalls };
    });

    expect(result.outsideIds.length).toBeGreaterThan(0);
    expect(result.insideIds.length).toBeGreaterThan(0);
    // 選び直しの間、縁への引き戻しが走らない
    expect(result.modCalls).toBe(0);
    expect(result.centers.length).toBeGreaterThan(0);
    // 最後の中心は選び直した範囲内の POI（紙の中）
    expect(result.centers[result.centers.length - 1].inside).toBe(true);
    // 途中で紙の縁（外したときに戻る点）へ止まらない
    for (const entry of result.centers) {
      if (!entry.center) continue;
      const distance = Math.hypot(entry.center[0] - result.edge[0], entry.center[1] - result.edge[1]);
      expect(distance).toBeGreaterThan(0.5);
    }
  });

  test('外から外へ、外してから同じ拍で選び直しても、中心の履歴に紙の縁が挟まらない', async ({ page }) => {
    await openDemo(page);
    const result = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const view = app.mapObject.getView();
      const idsOf = (map: any): string[] => {
        const source = map?.getSource?.('marker');
        return source
          ? source.getFeatures().map((f: any) => String(f.get('datum')?.namespaceID ?? ''))
          : [];
      };
      const outsideIds = idsOf(app.backMap);
      const settle = async (): Promise<void> => {
        let quiet = 0;
        for (let i = 0; i < 600 && quiet < 5; i++) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const busy =
            view.getAnimating() ||
            view.getInteracting() ||
            app.__outsideSelection?.pending === true;
          quiet = busy ? 0 : quiet + 1;
        }
      };
      const centers: { center: number[]; inside: boolean }[] = [];
      const record = (): void => {
        const center = view.getCenter();
        centers.push({ center, inside: !!center && !!app.from.insideCheckSysCoord(center) });
      };
      app.mapObject.on('moveend', record);
      let modCalls = 0;
      const original = app.from.modulateSysCoordInside;
      app.from.modulateSysCoordInside = function (this: any, center: number[]) {
        modCalls += 1;
        return original.call(this, center);
      };
      app.selectMarker(outsideIds[0]);
      await settle();
      // 画面の実際の順（前を外す → 新しいのを選ぶ）を、await を挟まずに同じ拍で行う
      app.unselectMarker();
      app.selectMarker(outsideIds[1]);
      await settle();
      app.mapObject.un('moveend', record);
      app.from.modulateSysCoordInside = original;
      return { outsideIds, centers, modCalls };
    });

    expect(result.outsideIds.length).toBeGreaterThan(1);
    // 縁への引き戻しが 1 度も走らない
    expect(result.modCalls).toBe(0);
    expect(result.centers.length).toBeGreaterThan(0);
    // 中心の履歴に紙の内側（縁）が挟まらない
    for (const entry of result.centers) expect(entry.inside).toBe(false);
  });

  test('外から内へ、外してから同じ拍で選び直しても、中心の履歴に紙の縁が挟まらない', async ({ page }) => {
    await openDemo(page);
    const result = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const view = app.mapObject.getView();
      const idsOf = (map: any): string[] => {
        const source = map?.getSource?.('marker');
        return source
          ? source.getFeatures().map((f: any) => String(f.get('datum')?.namespaceID ?? ''))
          : [];
      };
      const outsideIds = idsOf(app.backMap);
      const insideIds = idsOf(app.mapObject);
      const settle = async (): Promise<void> => {
        let quiet = 0;
        for (let i = 0; i < 600 && quiet < 5; i++) {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const busy =
            view.getAnimating() ||
            view.getInteracting() ||
            app.__outsideSelection?.pending === true;
          quiet = busy ? 0 : quiet + 1;
        }
      };
      app.selectMarker(outsideIds[0]);
      await settle();
      // 外したときに戻る先（紙の縁）を先に控える
      const edge = app.from.modulateSysCoordInside(view.getCenter());
      const centers: { center: number[]; inside: boolean }[] = [];
      const record = (): void => {
        const center = view.getCenter();
        centers.push({ center, inside: !!center && !!app.from.insideCheckSysCoord(center) });
      };
      app.mapObject.on('moveend', record);
      let modCalls = 0;
      const original = app.from.modulateSysCoordInside;
      app.from.modulateSysCoordInside = function (this: any, center: number[]) {
        modCalls += 1;
        return original.call(this, center);
      };
      // 画面の実際の順（前を外す → 新しいのを選ぶ）を、await を挟まずに同じ拍で行う
      app.unselectMarker();
      app.selectMarker(insideIds[0]);
      await settle();
      app.mapObject.un('moveend', record);
      app.from.modulateSysCoordInside = original;
      return { outsideIds, insideIds, edge, centers, modCalls };
    });

    expect(result.outsideIds.length).toBeGreaterThan(0);
    expect(result.insideIds.length).toBeGreaterThan(0);
    // 選び直しの間、縁への引き戻しが走らない
    expect(result.modCalls).toBe(0);
    expect(result.centers.length).toBeGreaterThan(0);
    // 最後の中心は選び直した範囲内の POI（紙の中）
    expect(result.centers[result.centers.length - 1].inside).toBe(true);
    // 途中で紙の縁（外したときに戻る点）へ止まらない
    for (const entry of result.centers) {
      if (!entry.center) continue;
      const distance = Math.hypot(entry.center[0] - result.edge[0], entry.center[1] - result.edge[1]);
      expect(distance).toBeGreaterThan(0.5);
    }
  });
});

test.describe('背面が GL（MapLibre）のとき', () => {
  test('背面の marker 層のピンが描かれ、紙の外で押せる', async ({ page }) => {
    test.setTimeout(180_000);
    // e2e/test.html は maplibre-gl を読み込み、MapLibre の地図を持つ（既存の GL の e2e と同じページ）
    await page.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as any).__MAPLAT_APP__ != null, null, { timeout: 60_000 });
    // MapLibre を前面にしてから古地図へ切り替えると、MapLibre が背面になる
    await page.locator('#maplibre').click();
    await page.waitForFunction(
      () => (window as any).__MAPLAT_APP__?.currentMapInfo?.().mapID === 'maplibre',
      null,
      { timeout: 60_000 }
    );
    await page.locator('#morioka').click();
    await page.waitForFunction(
      () => {
        const app = (window as any).__MAPLAT_APP__;
        return app?.currentMapInfo?.().mapID !== 'maplibre' && app?.backMap?.getSource?.()?.mapID === 'maplibre';
      },
      null,
      { timeout: 60_000 }
    );

    // 紙の外の POI（東京駅）を 1 件足して選ぶ（選ぶと中心に来るので、画面の中で当たりを測れる）
    const id = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_APP__;
      app.addPoiLayer('gl-outside', { name: '範囲外の POI' });
      return String(app.addMarker({ name: '範囲外の例', lnglat: [139.767125, 35.681236] }, 'gl-outside'));
    });
    await page.waitForFunction(
      (markerID) => {
        const app = (window as any).__MAPLAT_APP__;
        const source = app?.backMap?.getSource?.('marker');
        return !!source && source.getFeatures().some((f: any) => String(f.get('datum')?.namespaceID ?? '') === markerID);
      },
      id,
      { timeout: 30_000 }
    );
    await page.evaluate((markerID) => (window as any).__MAPLAT_APP__.selectMarker(markerID), id);
    await page.waitForFunction(
      () => {
        const app = (window as any).__MAPLAT_APP__;
        const view = app.mapObject.getView();
        return !view.getAnimating() && !app.__outsideSelection?.pending;
      },
      null,
      { timeout: 30_000 }
    );
    await page.waitForTimeout(500);

    const result = await page.evaluate((markerID) => {
      const app = (window as any).__MAPLAT_APP__;
      const feature = app.backMap
        .getSource('marker')
        .getFeatures()
        .find((f: any) => String(f.get('datum')?.namespaceID ?? '') === markerID);
      const tip = app.backMap.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
      const pixel = [tip[0], tip[1] - 36];
      const markerLayer = app.backMap.getLayer('marker');
      // 描かれたピンの画素で当たる（hit detection は描いた結果を使う）
      const hits = app.backMap.getFeaturesAtPixel(pixel, { layerFilter: (l: any) => l === markerLayer });
      const rect = app.backMap.getViewport().getBoundingClientRect();
      return {
        base: app.backMap.getSource()?.mapID,
        hit: hits.some((f: any) => String(f.get('datum')?.namespaceID ?? '') === markerID),
        inFront: app.mapObject
          .getSource('marker')
          .getFeatures()
          .some((f: any) => String(f.get('datum')?.namespaceID ?? '') === markerID),
        layerVisible: markerLayer.getVisible(),
        pageX: rect.left + pixel[0],
        pageY: rect.top + pixel[1]
      };
    }, id);
    expect(result.base).toBe('maplibre');
    expect(result.inFront).toBe(false);
    expect(result.layerVisible).toBe(true);
    expect(result.hit, '背面の GL の上に marker 層のピンが描かれていません').toBe(true);

    // 押すと clickMarker（前面と同じ形）
    await page.evaluate(() => {
      const w = window as any;
      w.__GL_CLICK__ = undefined;
      w.__MAPLAT_APP__.addEventListener('clickMarker', (e: any) => {
        w.__GL_CLICK__ = e.detail;
      });
    });
    await page.mouse.click(result.pageX, result.pageY);
    await page.waitForTimeout(500);
    const clicked = await page.evaluate(() => (window as any).__GL_CLICK__);
    expect(String(clicked?.namespaceID ?? '')).toBe(id);
  });
});
