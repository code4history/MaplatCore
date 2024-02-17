import fs from 'fs-extra';
const packageJson = fs.readJsonSync('./package.json');

const version = packageJson.version;
const filesToRename = {
  'maplat_core.js': `maplat.core.${version}.js`,
  'maplat_ui.js': `maplat.${version}.js`
};

Object.entries(filesToRename).forEach(([original, renamed]) => {
  fs.rename(`./dist/${original}`, `./dist/${renamed}`, (err) => {
    if (err) throw err;
    console.log(`${original} was renamed to ${renamed}`);
  });
});