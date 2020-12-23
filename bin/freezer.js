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
    name: 'output',
    short: 'o',
    type: 'string',
    description: 'Defines output filename',
    example: "'freezer.js --output=path' or 'freezer.js -o path'"
},{
    name: 'less',
    short: 'l',
    type: 'boolean',
    description: 'Defines output is less.',
    example: "'freezer.js --less' or 'freezer.js -l'"
}] ).run();
if (!args.options.source || !args.options.output) {
    throw 'Option source and output are mandatory.';
}

const fromPath = path.resolve(process.cwd(), args.options.source);
const toPath = path.resolve(process.cwd(), args.options.output);

const files = fs.readdirSync(fromPath).filter((file) => file.indexOf('.') !== 0);
const lists = {};
for (let i = 0; i < files.length; i++) {
    const fullPath = path.resolve(fromPath,files[i]);
    const dataUrl = base64Img.base64Sync(fullPath);
    lists[files[i]] = dataUrl;
}

const output = args.options.less ?
    Object.keys(lists).map((key) => {
        const body = (key.split("."))[0];
        return `@${body}: "${lists[key]}"`;
    }).join("\n") :
    `export default ${JSON.stringify(lists, null, 4)};`;
fs.writeFileSync(toPath, output, {});


