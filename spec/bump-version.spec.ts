import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

// scripts/bump-version.js（その中から呼ぶ scripts/sync-version.js も）を一時ディレクトリへ写し、
// 写しの package.json だけを書き換えさせる
const BUMP = resolve(__dirname, "../scripts/bump-version.js");
const SYNC = resolve(__dirname, "../scripts/sync-version.js");
const PKG = "@maplat/core";

const dirs: string[] = [];

const run = (
  version: string,
  bumpType: string
): { status: number; version: string; out: string } => {
  const dir = mkdtempSync(join(tmpdir(), "bump-version-"));
  dirs.push(dir);
  mkdirSync(join(dir, "scripts"));
  copyFileSync(BUMP, join(dir, "scripts", "bump-version.js"));
  copyFileSync(SYNC, join(dir, "scripts", "sync-version.js"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: PKG, version, type: "module" }));
  writeFileSync(join(dir, "README.md"), `> **Current release: \`${version}\`**\n`);
  writeFileSync(join(dir, "README.ja.md"), `> **現在のリリース: \`${version}\`**\n`);
  let status = 0;
  let out = "";
  try {
    out += execFileSync(process.execPath, [join(dir, "scripts", "bump-version.js"), bumpType], {
      stdio: "pipe"
    }).toString();
  } catch (error) {
    const e = error as { status?: number; stdout?: Buffer; stderr?: Buffer };
    status = e.status ?? 1;
    out += String(e.stdout ?? "") + String(e.stderr ?? "");
  }
  return {
    status,
    version: JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).version,
    out
  };
};

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("bump-version.js が prerelease の版を扱う", () => {
  it("1.2.3（prerelease 無し）は 1 つずつ上げる", () => {
    expect(run("1.2.3", "patch").version).toBe("1.2.4");
    expect(run("1.2.3", "minor").version).toBe("1.3.0");
    expect(run("1.2.3", "major").version).toBe("2.0.0");
  });

  it("1.3.0-rc.1 から上げる（semver の慣習: prerelease は同じ版へ仕上げる）", () => {
    expect(run("1.3.0-rc.1", "patch").version).toBe("1.3.0");
    expect(run("1.3.0-rc.1", "minor").version).toBe("1.3.0");
    expect(run("1.3.0-rc.1", "major").version).toBe("2.0.0");
  });

  it("1.3.0-rc.1. のような版は受け付けず、package.json を書き換えない", () => {
    const r = run("1.3.0-rc.1.", "patch");
    expect(r.status).not.toBe(0);
    expect(r.version).toBe("1.3.0-rc.1.");
    expect(r.out).not.toContain("NaN");
  });
});
