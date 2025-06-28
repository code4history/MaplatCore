import { describe, it, expect } from "vitest";
import { normalizeLayers } from "../src/normalize_pois";

// Import test data
import poitest1Input from "./input/poitest1.json";
import poitest2Input from "./input/poitest2.json";
import poitest3Input from "./input/poitest3.json";
import poitest1Expect from "./expect/poitest1.json";
import poitest2Expect from "./expect/poitest2.json";
import poitest3Expect from "./expect/poitest3.json";

describe("normalizePois test", () => {
  const testCases = [
    { input: poitest1Input, expect: poitest1Expect },
    { input: poitest2Input, expect: poitest2Expect },
    { input: poitest3Input, expect: poitest3Expect }
  ];

  testCases.forEach((testCase, index) => {
    it(testCase.input.title, async () => {
      const testout = await normalizeLayers(testCase.input.data, testCase.input.options);
      // Deep clone to avoid reference issues
      expect(JSON.parse(JSON.stringify(testout))).toEqual(testCase.expect);
    });
  });
});
