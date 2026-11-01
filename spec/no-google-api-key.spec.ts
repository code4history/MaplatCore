import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// 追跡ファイルに Google の API キーの形の文字列が戻らないことを確かめる。
// 失敗の表示に値を出さないよう、断言はファイル名だけで行う。
const GOOGLE_KEY_SHAPE = /AIza[0-9A-Za-z_-]{35}/;
const BINARY_FILE = /\.(png|jpe?g|woff2?|ico|zip)$/i;

const repoRoot = resolve(__dirname, "..");

function trackedTextFiles(): string[] {
  return execFileSync("git", ["ls-files", "-z"], { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter((path) => path !== "" && !BINARY_FILE.test(path))
    .filter((path) => lstatSync(join(repoRoot, path), { throwIfNoEntry: false })?.isFile() === true);
}

describe("Google API key in tracked files", () => {
  it("no tracked file holds a string shaped like a Google API key", () => {
    const files = trackedTextFiles();
    expect(files.length).toBeGreaterThan(0);
    const matched = files.filter((path) => GOOGLE_KEY_SHAPE.test(readFileSync(join(repoRoot, path), "latin1")));
    expect(matched).toEqual([]);
  });

  it("secret scanning ignores exactly the expected paths", () => {
    const config = readFileSync(join(repoRoot, ".github/secret_scanning.yml"), "utf8");
    const ignored = [...config.matchAll(/^\s*-\s*"([^"]+)"\s*$/gm)].map((match) => match[1]);
    expect(ignored.sort()).toEqual(
      [
        "e2e/maplat-legacy.spec.ts",
        "e2e/test.html",
        "tests/consumption/esm-cdn.html",
        "tests/consumption/self-hosted.html",
        "tests/consumption/umd-cdn.html",
      ].sort(),
    );
  });
});
