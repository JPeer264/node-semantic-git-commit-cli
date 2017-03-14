import test from 'ava';
import path from 'path';
import json from 'json-extra';
import getConfig from '../lib/getConfig';

const cwd = process.cwd();
const fixtures = path.join(cwd, 'test', 'fixtures');

test('read config from a specific path', (t) => {
  t.deepEqual(getConfig(path.join(fixtures, '.sgcrc')), json.readToObjSync(path.join(fixtures, '.sgcrc')))
});

test('read config from package.json', (t) => {
  t.deepEqual(getConfig(), json.readToObjSync(path.join(fixtures, '.sgcrc')))
});
