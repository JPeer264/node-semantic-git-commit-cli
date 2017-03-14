import test from 'ava';
import path from 'path';
import json from 'json-extra';
import fs from 'fs';
import getConfig from '../lib/getConfig';

const cwd = process.cwd();
const fixtures = path.join(cwd, 'test', 'fixtures');

test('read config from a specific path', (t) => {
  t.deepEqual(getConfig(path.join(fixtures, '.sgcrc')), json.readToObjSync(path.join(fixtures, '.sgcrc')));
});

test('read config from a .sgcrc_default', (t) => {
  t.deepEqual(getConfig(), json.readToObjSync(path.join(cwd, '.sgcrc_default')));
});

test('read config from package.json', (t) => {
  let sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));
  let packageJson = json.readToObjSync(path.join(cwd, 'package.json'));
  packageJson.sgc = sgcrc;

  // copy package.json to package.json.back
  Promise.resolve(fs.createReadStream(cwd + '/package.json')
    .pipe(fs.createWriteStream(cwd + '/package.json.back')))
    .then(() => {
      // delete package.json
      fs.unlink(cwd + '/package.json');
    })
    .then(() => {
      // write new package.json with the sgc property
      fs.writeFile(cwd + '/package.json', JSON.stringify(packageJson), () => {
        // perform test
        t.deepEqual(getConfig(), sgcrc);
      });
    }).then(() => {
      // delete package.json
      fs.unlink(cwd + '/package.json');
    }).then(() => {
      // restore package.json from package.json.back
      fs.rename(cwd + '/package.json.back', cwd + '/package.json');
    });
});
