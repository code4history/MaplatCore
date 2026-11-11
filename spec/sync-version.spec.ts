import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

// scripts/sync-version.js を一時ディレクトリへ写し、写しの README だけを書き換えさせる
const SCRIPT = resolve(__dirname, "../scripts/sync-version.js");
const PKG = "@maplat/core";

// もともと版を書いている形（どれも 1.2.0-rc.1 を持たせる）
const VERSIONED_PREFIXES = [
  "npm install @maplat/core",
  "deno add @maplat/core",
  "npx jsr add @maplat/core",
  "jsr:@maplat/core",
  "npm:@maplat/core"
];

// 版の無い形（版を足してはいけない）
const UNVERSIONED_LINES = [`npm install ${PKG}`, `pnpm add ${PKG}`];

const readme = (releaseLabel: string, extra: string[] = []): string =>
  [
    `> **${releaseLabel}: \`1.2.0-rc.1\`**`,
    "",
    ...UNVERSIONED_LINES,
    ...VERSIONED_PREFIXES.map((p) => `${p}@1.2.0-rc.1`),
    `npm install ${PKG}@1.1.0`,
    `<script src="https://cdn.jsdelivr.net/npm/${PKG}@1.2.0-rc.1/dist/index.umd.js"></script>`,
    ...extra,
    ""
  ].join("\n");

const dirs: string[] = [];

const run = (version: string, extra: string[] = []): { en: string; ja: string } => {
  const dir = mkdtempSync(join(tmpdir(), "sync-version-"));
  dirs.push(dir);
  mkdirSync(join(dir, "scripts"));
  copyFileSync(SCRIPT, join(dir, "scripts", "sync-version.js"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: PKG, version, type: "module" }));
  writeFileSync(join(dir, "README.md"), readme("Current release", extra));
  writeFileSync(join(dir, "README.ja.md"), readme("現在のリリース", extra));
  execFileSync(process.execPath, [join(dir, "scripts", "sync-version.js")], { stdio: "pipe" });
  return {
    en: readFileSync(join(dir, "README.md"), "utf8"),
    ja: readFileSync(join(dir, "README.ja.md"), "utf8")
  };
};

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("sync-version.js with prerelease versions", () => {
  it("replaces every versioned reference with a prerelease version and leaves unversioned lines alone", () => {
    const { en, ja } = run("1.3.0-rc.2");
    for (const text of [en, ja]) {
      const lines = text.split("\n");
      for (const p of VERSIONED_PREFIXES) expect(lines).toContain(`${p}@1.3.0-rc.2`);
      for (const line of UNVERSIONED_LINES) expect(lines).toContain(line);
      expect(text).toContain(`cdn.jsdelivr.net/npm/${PKG}@1.3.0-rc.2/dist/index.umd.js`);
      expect(text).not.toContain("-rc.1");
      expect(text).not.toContain("1.2.0");
      expect(text).not.toContain("1.1.0");
    }
    expect(en).toContain("Current release: `1.3.0-rc.2`");
    expect(ja).toContain("現在のリリース: `1.3.0-rc.2`");
  });

  it("drops the prerelease suffix when moving to a stable version", () => {
    const { en, ja } = run("1.3.0");
    for (const text of [en, ja]) {
      const lines = text.split("\n");
      expect(text).not.toContain("-rc.");
      for (const p of VERSIONED_PREFIXES) expect(lines).toContain(`${p}@1.3.0`);
      for (const line of UNVERSIONED_LINES) expect(lines).toContain(line);
      expect(text).toContain(`cdn.jsdelivr.net/npm/${PKG}@1.3.0/dist/index.umd.js`);
    }
    expect(en).toContain("Current release: `1.3.0`");
    expect(ja).toContain("現在のリリース: `1.3.0`");
  });

  it("文末の . を prerelease の中に取り込まない（1.2.3・1.3.0-rc.1・1.3.0-rc.1.）", () => {
    // 本文の版付きの行と数え分けられるよう、コードの範囲（`…`）で括った行を使う
    const extra = [
      `\`npm install ${PKG}@1.2.3\``,
      `\`npm install ${PKG}@1.2.3.\``,
      `\`npm install ${PKG}@1.3.0-rc.1\``,
      `\`npm install ${PKG}@1.3.0-rc.1.\``
    ];
    for (const text of Object.values(run("2.0.0", extra))) {
      const lines = text.split("\n");
      // 文末の . が残る行（1.2.3. と 1.3.0-rc.1.）と、残らない行（1.2.3 と 1.3.0-rc.1）が 2 行ずつ
      expect(lines.filter((l) => l === `\`npm install ${PKG}@2.0.0.\``)).toHaveLength(2);
      expect(lines.filter((l) => l === `\`npm install ${PKG}@2.0.0\``)).toHaveLength(2);
      expect(text).not.toContain("1.2.3");
      expect(text).not.toContain("1.3.0-rc.1");
    }
  });
});
