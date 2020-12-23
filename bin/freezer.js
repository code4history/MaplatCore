#! /usr/bin/env node

const process = require('process');
const argv = require('argv');
const path = require('path');
const fs = require('fs-extra');
const base64Img = require('base64-img');

const args = argv.option( [{
    name: 'source',
    short: 's',
    type: 'string',
    description: 'Source directory of images to be freezed',
    example: "'freezer.js --source=path' or 'freezer.js -s path'"
},{
    name: 'freeze_output',
    short: 'f',
    type: 'string',
    description: 'Defines output filename of freezed result',
    example: "'freezer.js --freeze_output=path' or 'freezer.js -f path'"
},{
    name: 'url_output',
    short: 'u',
    type: 'string',
    description: 'Defines output filename of relative url result',
    example: "'freezer.js --url_output=path' or 'freezer.js -u path'"
},{
    name: 'less',
    short: 'l',
    type: 'boolean',
    description: 'Defines output is less.',
    example: "'freezer.js --less' or 'freezer.js -l'"
}] ).run();
if (!args.options.source || !args.options.freeze_output || !args.options.url_output) {
    throw 'Option source, freeze_output and url_output are mandatory.';
}

const fromPath = path.resolve(process.cwd(), args.options.source);
const toFPath = path.resolve(process.cwd(), args.options.freeze_output);
const toUPath = path.resolve(process.cwd(), args.options.url_output);

const files = fs.readdirSync(fromPath).filter((file) => file.indexOf('.') !== 0);
const fLists = {};
const uLists = {};
for (let i = 0; i < files.length; i++) {
    const fullPath = path.resolve(fromPath,files[i]);
    const dataUrl = base64Img.base64Sync(fullPath);
    fLists[files[i]] = dataUrl;
    uLists[files[i]] = `${args.options.source}/${files[i]}`;
}

const fOutput = args.options.less ?
    Object.keys(fLists).map((key) => {
        const body = (key.split("."))[0];
        return `@${body}: "${fLists[key]}"`;
    }).join("\n") :
    `export default ${JSON.stringify(fLists, null, 4)};`;
fs.writeFileSync(toFPath, fOutput, {});

if (!args.options.less) {
    const uOutput = `export default ${JSON.stringify(uLists, null, 4)};`;
    fs.writeFileSync(toUPath, uOutput, {});
}
