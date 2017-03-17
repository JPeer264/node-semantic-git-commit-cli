import fs from 'fs-extra';
import os from 'os';
import test from 'ava';
import path from 'path';
import json from 'json-extra';
import getConfig from '../lib/getConfig';

const cwd = process.cwd();
const homedir = os.homedir();
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
  const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
  packageJson.sgc = sgcrc;

  fs.renameSync(path.join(cwd, 'package.json'), path.join(cwd, `package.json.${randomString}.back`));
  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify(packageJson));
  t.deepEqual(getConfig(), sgcrc);
  fs.removeSync(path.join(cwd, 'package.json'));
  fs.renameSync(path.join(cwd, `package.json.${randomString}.back`), path.join(cwd, 'package.json'));
});

test('read global config', (t) => {
  let globalExist = false;
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));
  const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);

  if (fs.existsSync(path.join(homedir, '.sgcrc'))) {
    globalExist = true;
    fs.renameSync(path.join(homedir, '.sgcrc'), path.join(homedir, `.sgcrc.${randomString}.back`));
  }

  fs.writeFileSync(path.join(homedir, '.sgcrc'), JSON.stringify(sgcrc));
  t.deepEqual(getConfig(), sgcrc);
  fs.removeSync(path.join(homedir, '.sgcrc'));

  if (globalExist) {
    fs.renameSync(path.join(homedir, `.sgcrc.${randomString}.back`), path.join(homedir, '.sgcrc'));
  }
});
