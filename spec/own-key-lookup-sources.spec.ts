import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(__dirname, "..", path), "utf8");

const cacheHashIndexing = (source: string) =>
  source.split("\n").filter(line => /cacheHash(\?\.)?\[/.test(line));

/** Text from `start` up to the next method named `end`. */
const between = (source: string, start: string, end: string) => {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  expect(from).toBeGreaterThanOrEqual(0);
  expect(to).toBeGreaterThan(from);
  return source.slice(from, to);
};

describe("keys that come from outside are looked up as own keys", () => {
  const index = read("src/index.ts");
  const element = read("src/element.ts");
  const mixin = read("src/source/mixin.ts");

  it("indexes cacheHash directly only for the write and the internal identity check", () => {
    const lines = cacheHashIndexing(index);
    expect(lines).toHaveLength(2);
    expect(lines.filter(line => line.includes("this.cacheHash[source.mapID] = source"))).toHaveLength(1);
    expect(lines.filter(line => line.includes("this.cacheHash?.[source.mapID] === source"))).toHaveLength(1);
  });

  it("does not index cacheHash from the element", () => {
    expect(cacheHashIndexing(element)).toHaveLength(0);
  });

  it("creates cacheHash without a prototype", () => {
    expect(index.split("\n").filter(line => /cacheHash = Object\.create\(null\)/.test(line))).toHaveLength(1);
  });

  it("does not index pois directly in either getPoiLayer", () => {
    expect(between(index, "getPoiLayer(id: any) {", "addPoiLayer(id: any")).not.toContain("this.pois[");
    expect(between(mixin, "getPoiLayer(id: string) {", "addPoiLayer(id: string")).not.toContain("this.pois[");
  });

  it("does not index pois directly with a layer ID from the marker methods", () => {
    expect(index).not.toContain("this.pois[clusterId]");
    expect(mixin).not.toContain("this.pois[clusterId]");
  });
});
