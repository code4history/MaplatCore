const fs = require('fs');
const {createIconSet} = require('../src/template_works');

describe('template_works test', function() {
    for (let i=1; i<=3; i++) {
        const testin = require(`./input/temtest${i}.json`);
        let testex;
        try {
            testex = require(`./expect/temtest${i}.json`);
        } catch(e) {}
        it(testin.title, () => {
            const testout = createIconSet(testin.data, testin.template, testin.fallback);
            //if (i == 3) fs.writeFileSync(`./spec/expect/temtest${i}.json`, JSON.stringify(testout, null, 2));
            expect(JSON.parse(JSON.stringify(testout))).toEqual(testex);
        });
    }
});