import test from 'ava';
import execa from 'execa';
import { homedir } from 'os';
import path from 'path';
import fs from 'fs-extra';
import tempDir from 'temp-dir';
import randomstring from 'randomstring';

import pkg from '../package.json';

const cli = path.resolve('dest/cli.js');
const testTempDir = path.join(tempDir, 'sgcTest');

test.before(async () => {
  await fs.ensureDir(testTempDir);
});

test.beforeEach(async (t) => {
  const tempString = randomstring.generate();
  const tempPath = path.resolve(path.join(testTempDir, tempString));

  // eslint-disable-next-line no-param-reassign
  t.context.tempString = tempString;
  // eslint-disable-next-line no-param-reassign
  t.context.tempPath = tempPath;

  await fs.ensureDir(tempPath);
  process.chdir(tempPath);
});

test.afterEach(() => {
  process.chdir(path.join(__dirname, '..'));
});

test.after.always(async () => {
  await fs.remove(testTempDir);
});

test('should print the right version', async (t) => {
  const { stdout } = await execa(cli, ['--version']);

  t.is(stdout, `v${pkg.version}`);
});

test('should fail on non git repository', async (t) => {
  const { stderr } = await execa(cli);

  t.is(stderr, 'fatal: Not a git repository (or any of the parent directories): .git');
});

test('should fail on git repos where nothing is added', async (t) => {
  await execa('git', ['init']);

  const { stderr } = await execa(cli);

  t.is(stderr, 'Please git add some files first before you commit.');
});
