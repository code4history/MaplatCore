/* eslint-disable @typescript-eslint/no-var-requires */
import { createIconSet, createHtmlFromTemplate } from "../src/template_works";

describe("template_works test", () => {
  for (let i = 1; i <= 3; i++) {
    const testin = require(`./input/temtest${i}.json`);
    let testexIcn: any;
    let testexPoi: any;
    try {
      testexIcn = require(`./expect/temicntest${i}.json`);
      testexPoi = require(`./expect/tempoitest${i}.json`);
    } catch (e) {
      console.error(e);
    }

    it(`${testin.title} (Icon)`, () => {
      const testoutIcn = createIconSet(
        Object.assign({}, testin.data),
        testin.ancestors[0],
        testin.ancestors[1],
        testin.ancestors[2]
      );
      //if (i == 3) fs.writeFileSync(`./spec/expect/temicntest${i}.json`, JSON.stringify(testoutIcn, null, 2));
      expect(JSON.parse(JSON.stringify(testoutIcn))).toEqual(testexIcn);
    });

    it(`${testin.title} (POI)`, () => {
      const testoutPoi = createHtmlFromTemplate(
        Object.assign({}, testin.data),
        testin.ancestors[0],
        testin.ancestors[1],
        testin.ancestors[2]
      );
      //if (i == 3) fs.writeFileSync(`./spec/expect/tempoitest${i}.json`, JSON.stringify(testoutPoi, null, 2));
      expect(JSON.parse(JSON.stringify(testoutPoi))).toEqual(testexPoi);
    });
  }
});
