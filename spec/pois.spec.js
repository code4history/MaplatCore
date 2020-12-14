import { normalizeLayers } from '../src/normalize_pois';
import testHelper from './TestHelper';

describe('normalizePois test', () => {
  for (let i = 1; i <= 3; i++) {
    const testin = require(`./input/poitest${i}.json`);
    let testex;
    try {
      testex = require(`./expect/poitest${i}.json`);
    } catch (e) { console.error(e); }
    it(testin.title, testHelper.helperAsync(async () => {
      const testout = await normalizeLayers(testin.data, testin.options);
      //if (i == 1) fs.writeFileSync(`./spec/expect/poitest${i}.json`, JSON.stringify(testout, null, 2));
      expect(JSON.parse(JSON.stringify(testout))).toEqual(testex);
    }));
  }
});
