import { describe, it, expect } from "vitest";
import { createIconSet, createHtmlFromTemplate } from "../src/template_works";

// Import test data
import temtest1Input from "./input/temtest1.json";
import temtest2Input from "./input/temtest2.json";
import temtest3Input from "./input/temtest3.json";
import temicntest1Expect from "./expect/temicntest1.json";
import temicntest2Expect from "./expect/temicntest2.json";
import temicntest3Expect from "./expect/temicntest3.json";
import tempoitest1Expect from "./expect/tempoitest1.json";
import tempoitest2Expect from "./expect/tempoitest2.json";
import tempoitest3Expect from "./expect/tempoitest3.json";

describe("template_works test", () => {
  const testCases = [
    { input: temtest1Input, expectIcon: temicntest1Expect, expectPoi: tempoitest1Expect },
    { input: temtest2Input, expectIcon: temicntest2Expect, expectPoi: tempoitest2Expect },
    { input: temtest3Input, expectIcon: temicntest3Expect, expectPoi: tempoitest3Expect }
  ];

  testCases.forEach((testCase) => {
    it(`${testCase.input.title} (Icon)`, () => {
      const testoutIcn = createIconSet(
        Object.assign({}, testCase.input.data),
        testCase.input.ancestors[0],
        testCase.input.ancestors[1],
        testCase.input.ancestors[2]
      );
      // Deep clone to avoid reference issues
      expect(JSON.parse(JSON.stringify(testoutIcn))).toEqual(testCase.expectIcon);
    });

    it(`${testCase.input.title} (POI)`, () => {
      const testoutPoi = createHtmlFromTemplate(
        Object.assign({}, testCase.input.data),
        testCase.input.ancestors[0],
        testCase.input.ancestors[1],
        testCase.input.ancestors[2]
      );
      // Deep clone to avoid reference issues
      expect(JSON.parse(JSON.stringify(testoutPoi))).toEqual(testCase.expectPoi);
    });
  });
});
