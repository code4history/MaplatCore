// createOnceWarner（src/functions.ts）の検査。
// 旧クラスの起動時キーのロックと設定ファイルの機能系キーの警告、
// 要素の warnOnce が共有する「キーごとに 1 回だけ警告する」しくみ。
import { describe, it, expect, vi, afterEach } from "vitest";
import { createOnceWarner } from "../src/functions";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createOnceWarner", () => {
  it("同じキーでは 1 回だけ警告し、違うキーは別に 1 回ずつ警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const warnOnce = createOnceWarner();
    warnOnce("a", "message a");
    warnOnce("a", "message a again");
    warnOnce("b", "message b");
    warnOnce("b", "message b again");
    warnOnce("a", "message a third");
    expect(warn.mock.calls.map(c => c[0])).toEqual(["message a", "message b"]);
  });

  it("作るたびに独立している（インスタンスごとに 1 回）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const first = createOnceWarner();
    const second = createOnceWarner();
    first("key", "first");
    second("key", "second");
    first("key", "first again");
    expect(warn.mock.calls.map(c => c[0])).toEqual(["first", "second"]);
  });
});
