import test from 'ava';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import tempDir from 'temp-dir';
import { stub } from 'sinon';
import proxyquire from 'proxyquire';

stub(console, 'error');

const gitCommitExeca = stub();
const retryCommit = proxyquire
  .noCallThru()
  .noPreserveCache()
  .load('../../lib/helpers/retryCommit', {
    './gitCommitExeca': gitCommitExeca,
  });

const filename = 'testretry';
const sgcTempDir = path.join(tempDir, 'sgc');
const pathToRetryFile = path.join(sgcTempDir, `${filename}.txt`);

test('commit should fail', async (t) => {
  await retryCommit.default(filename);

  t.is(console.error.args[0][0], chalk.red('No previous failed commit found.'));
});

test('commit should pass', async (t) => {
  await fs.ensureDir(sgcTempDir);
  await fs.writeFile(pathToRetryFile, 'new commit', 'utf8');
  await retryCommit.default(filename);

  t.is(gitCommitExeca.args[0][0], 'new commit');
});
