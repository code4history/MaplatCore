// 入口の機械検査の共通部分（spec/common-entry.spec.ts・spec/template-entry.spec.ts が使う）。
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";

export const ROOT = resolve(__dirname, "..");
/** 地図の入口（@maplat/core）以外が import してはいけない外部のパッケージ */
export const FORBIDDEN = /^(ol(\/|$)|@c4h\/weiwudi|@maplat\/transform|@turf\/|maplibre-gl|mapbox-gl)/;

/** 入口から相対 import をたどり、[ファイル, 外部の import 先] を集める。 */
export function walk(entry: string) {
  const files = new Set<string>();
  const external = new Map<string, Set<string>>();
  const stack = [resolve(ROOT, entry)];
  while (stack.length) {
    const file = stack.pop()!;
    if (files.has(file)) continue;
    files.add(file);
    if (!/\.(ts|js)$/.test(file)) continue;
    // 行コメント・ブロックコメントの中の import の例は数えない
    const src = readFileSync(file, "utf-8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    // import ... from "x" / export ... from "x" / import "x"（型だけの import も数える＝型の連鎖も OL に触れない）
    const specs = [...src.matchAll(/(?:import|export)\s[^;]*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g)].map(
      m => m[1] ?? m[2]
    );
    for (const spec of specs) {
      if (spec.startsWith(".")) {
        const base = resolve(dirname(file), spec);
        const candidates = [base, `${base}.ts`, `${base}/index.ts`];
        const hit = candidates.find(c => existsSync(c) && !c.endsWith("/") && /\.(ts|json|png|jpg)$/.test(c));
        if (!hit) throw new Error(`cannot resolve ${spec} from ${file}`);
        stack.push(hit);
      } else {
        if (!external.has(spec)) external.set(spec, new Set());
        external.get(spec)!.add(file.replace(`${ROOT}/`, ""));
      }
    }
  }
  return { files: [...files].map(f => f.replace(`${ROOT}/`, "")).sort(), external };
}
