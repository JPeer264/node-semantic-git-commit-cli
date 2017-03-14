import test from 'ava';
import path from 'path';
import json from 'json-extra';
import fs from 'fs-extra';
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

  fs.createReadStream(cwd + '/package.json')
    .pipe(fs.createWriteStream(cwd + '/package.json.back'));
  fs.unlinkSync(cwd + '/package.json');
  fs.writeFileSync(cwd + '/package.json', JSON.stringify(packageJson));
  t.deepEqual(getConfig(), sgcrc);
  fs.unlinkSync(cwd + '/package.json');
  fs.renameSync(cwd + '/package.json.back', cwd + '/package.json');
});
