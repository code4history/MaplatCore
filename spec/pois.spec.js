const { normalizeLayers } = require('../src/normalize_pois');
const testHelper = require('./TestHelper');
const fs = require('fs');

describe('normalizePois test', function() {
    for (let i=1; i<=3; i++) {
        const testin = require(`./input/poitest${i}.json`);
        let testex;
        try {
            testex = require(`./expect/poitest${i}.json`);
        } catch(e) {}
        it(testin.title, testHelper.helperAsync(async () => {
            const testout = await normalizeLayers(testin.data, testin.options);
            //if (i == 3) fs.writeFileSync(`./spec/expect/poitest${i}.json`, JSON.stringify(testout, null, 2));
            expect(JSON.parse(JSON.stringify(testout))).toEqual(testex);
        }));
    }
});