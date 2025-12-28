import { describe, it, expect } from "vitest";
import { Quyuan } from "@c4h/quyuan";
import * as turf from "@turf/turf";
import { prepareTemplates } from "../src/template_works";

// Import test data
import qytest1Input from "./input/qytest1.json";
import qytest2Input from "./input/qytest2.json";
import qytest3Input from "./input/qytest3.json";
import qytest1Expect from "./expect/qytest1.json";
import qytest2Expect from "./expect/qytest2.json";
import qytest3Expect from "./expect/qytest3.json";

describe("quyuan_works test", () => {
  const testCases = [
    { input: qytest1Input, expect: qytest1Expect },
    { input: qytest2Input, expect: qytest2Expect },
    { input: qytest3Input, expect: qytest3Expect }
  ];

  testCases.forEach((testCase) => {
    it(testCase.input.title, () => {
      const geojson = turf.point([0, 0], testCase.input.data);
      const templates = prepareTemplates(...testCase.input.ancestors);

      const result = Quyuan.templateExtractor({ geojson, templates});

      expect(testCase.expect).toEqual((result as any).result);
    });
  });
});
