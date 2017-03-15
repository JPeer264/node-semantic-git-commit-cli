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
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));
  const packageJson = json.readToObjSync(path.join(cwd, 'package.json'));
  packageJson.sgc = sgcrc;

  fs.copySync(path.join(cwd, 'package.json'), path.join(cwd, 'package.json.back'));
  fs.unlinkSync(path.join(cwd, 'package.json'));
  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify(packageJson));
  t.deepEqual(getConfig(), sgcrc);
  fs.unlinkSync(path.join(cwd, 'package.json'));
  fs.renameSync(path.join(cwd, 'package.json.back'), path.join(cwd, 'package.json'));
});
