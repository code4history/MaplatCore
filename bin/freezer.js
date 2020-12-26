#! /usr/bin/env node

const process = require('process');
const argv = require('argv');
const path = require('path');
const fs = require('fs-extra');

const args = argv.option([{
  name: 'i18n',
  short: 'i',
  type: 'boolean',
  description: 'Defines output is i18n resources.',
  example: "'freezer.js --i18n' or 'freezer.js -i'"
}]).run();

const fromPath = path.resolve(process.cwd(), args.options.source);
const toFPath = path.resolve(process.cwd(), args.options.freeze_output);

const files = fs.readdirSync(fromPath).filter(file => file.indexOf('.') !== 0).sort();
const fLists = {};
if (args.options.i18n) {
  for (let i = 0; i < files.length; i++) {
    const lang = files[i];
    const json = require(path.resolve(fromPath, `${lang}${path.sep}translation.json`));
    fLists[lang] = {
      translation: json
    };
  }
  fs.writeFileSync(toFPath, `export default ${JSON.stringify(fLists, null, 2)};`, {});
}
