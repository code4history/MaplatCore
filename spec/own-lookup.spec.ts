import { describe, expect, it } from "vitest";
import { ownEntry } from "../src/own-lookup";

describe("ownEntry", () => {
  it.each(["constructor", "__proto__", "toString", "hasOwnProperty"])(
    "does not return the inherited key %s",
    key => {
      expect(ownEntry({}, key)).toBeUndefined();
    }
  );

  it("returns undefined when the record is not an object", () => {
    expect(ownEntry(undefined, "x")).toBeUndefined();
    expect(ownEntry(null, "x")).toBeUndefined();
    expect(ownEntry("text", "length")).toBeUndefined();
  });

  it("returns undefined when the key is not a string", () => {
    expect(ownEntry({}, 42)).toBeUndefined();
    expect(ownEntry({}, undefined)).toBeUndefined();
    expect(ownEntry({ 42: "a" }, 42)).toBeUndefined();
    expect(ownEntry({ a: 1 }, Symbol.iterator)).toBeUndefined();
  });

  it("returns undefined for a key the record does not have", () => {
    expect(ownEntry({ a: 1 }, "")).toBeUndefined();
    expect(ownEntry({ a: 1 }, "x".repeat(10_000))).toBeUndefined();
  });

  it("returns an own value", () => {
    expect(ownEntry({ a: 1 }, "a")).toBe(1);
  });

  it("reads a record without a prototype", () => {
    const record = Object.create(null);
    record.a = 1;
    expect(ownEntry(record, "a")).toBe(1);
    expect(ownEntry(record, "toString")).toBeUndefined();
  });

  it("reads an own key that shares a name with an inherited one", () => {
    const record = Object.create(null);
    record.__proto__ = "own";
    expect(ownEntry(record, "__proto__")).toBe("own");
  });
});
