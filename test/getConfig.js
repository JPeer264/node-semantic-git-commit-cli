import os from 'os';
import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import json from 'json-extra';

import getConfig from '../lib/getConfig';

const cwd = process.cwd();
const homedir = os.homedir();
const fixtures = path.join(cwd, 'test', 'fixtures');
const date = new Date();
const datetime = date.toISOString().slice(0, 10);
const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);

let globalExist = false;


// rename global .sgcrc
test.before(() => {
  if (fs.existsSync(path.join(homedir, '.sgcrc'))) {
    globalExist = true;
    fs.renameSync(path.join(homedir, '.sgcrc'), path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`));
  }
});

test.after(() => {
  if (globalExist) {
    fs.renameSync(path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`), path.join(homedir, '.sgcrc'));
  }
});

test('read config from a specific path', (t) => {
  t.deepEqual(getConfig(path.join(fixtures, '.sgcrc')), json.readToObjSync(path.join(fixtures, '.sgcrc')));
});

test('read config from a .sgcrc_default', (t) => {
  t.deepEqual(getConfig(), json.readToObjSync(path.join(cwd, '.sgcrc_default')));
});

test.serial('read config from package.json', (t) => {
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));
  const packageJson = json.readToObjSync(path.join(cwd, 'package.json'));

  packageJson.sgc = sgcrc;

  // manipulate local package
  fs.renameSync(path.join(cwd, 'package.json'), path.join(cwd, `package.json.${randomString}-${datetime}.back`));
  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify(packageJson));

  t.deepEqual(getConfig(), sgcrc);

  // revert local package
  fs.removeSync(path.join(cwd, 'package.json'));
  fs.renameSync(path.join(cwd, `package.json.${randomString}-${datetime}.back`), path.join(cwd, 'package.json'));
});

test('read global config', (t) => {
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));

  fs.writeFileSync(path.join(homedir, '.sgcrc'), JSON.stringify(sgcrc));
  t.deepEqual(getConfig(), sgcrc);
  fs.removeSync(path.join(homedir, '.sgcrc'));
});
