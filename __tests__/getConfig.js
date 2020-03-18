import fs from 'fs-extra';
import json from 'json-extra';
import os from 'os';
import path from 'path';

import getConfig from '../lib/getConfig';

const cwd = process.cwd();
const homedir = os.homedir();
const fixtures = path.join(cwd, '__tests__', 'fixtures');
const date = new Date();
const datetime = date.toISOString().slice(0, 10);
const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);

let globalExist = false;

// rename global .sgcrc
beforeAll(() => {
  // rename global sgcrc
  if (fs.existsSync(path.join(homedir, '.sgcrc'))) {
    globalExist = true;
    fs.renameSync(path.join(homedir, '.sgcrc'), path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`));
  }

  // rename local sgcrc
  fs.renameSync(path.join(cwd, '.sgcrc'), path.join(cwd, '.sgcrc_default'));
});

afterAll(() => {
  // rename global sgrc
  if (globalExist) {
    fs.renameSync(path.join(homedir, `.sgcrc.${randomString}-${datetime}.back`), path.join(homedir, '.sgcrc'));
  }

  // rename local sgcrc
  fs.renameSync(path.join(cwd, '.sgcrc_default'), path.join(cwd, '.sgcrc'));
});

it('read config from a specific path', () => {
  expect(getConfig(fixtures)).toEqual(json.readToObjSync(path.join(fixtures, '.sgcrc')));
});

it('read config from a .sgcrc_default', () => {
  const globalConfig = json.readToObjSync(path.join(cwd, '.sgcrc_default'));

  expect(getConfig()).toEqual(globalConfig);
});

it('read config from package.json', () => {
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));
  const packageJson = json.readToObjSync(path.join(cwd, 'package.json'));

  packageJson.sgc = sgcrc;

  // manipulate local package
  fs.renameSync(path.join(cwd, 'package.json'), path.join(cwd, `package.json.${randomString}-${datetime}.back`));
  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify(packageJson));

  const config = getConfig();

  // revert local package
  fs.removeSync(path.join(cwd, 'package.json'));
  fs.renameSync(path.join(cwd, `package.json.${randomString}-${datetime}.back`), path.join(cwd, 'package.json'));

  expect(config).toEqual(sgcrc);
});

it('read global config', () => {
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));

  fs.writeFileSync(path.join(homedir, '.sgcrc'), JSON.stringify(sgcrc));
  expect(getConfig()).toEqual(sgcrc);
  fs.removeSync(path.join(homedir, '.sgcrc'));
});

it('read local config from `sgc.config.js`', () => {
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));

  fs.writeFileSync(path.join(cwd, 'sgc.config.js'), `module.exports = (${JSON.stringify(sgcrc)})`);
  expect(getConfig()).toEqual(sgcrc);
  fs.removeSync(path.join(cwd, 'sgc.config.js'));
});

it('read global config from `sgc.config.js`', () => {
  const sgcrc = json.readToObjSync(path.join(fixtures, '.sgcrc'));

  fs.writeFileSync(path.join(homedir, 'sgc.config.js'), `module.exports = (${JSON.stringify(sgcrc)})`);
  expect(getConfig()).toEqual(sgcrc);
  fs.removeSync(path.join(homedir, 'sgc.config.js'));
});

it('read a .sgcrc_default from a deep nested cwd', () => {
  const deepCwd = path.join(fixtures, 'very', 'deep', 'directory');
  const fixturesConfig = json.readToObjSync(path.join(fixtures, '.sgcrc'));

  expect(getConfig(deepCwd)).toEqual(fixturesConfig);
});
