import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import tempDir from 'temp-dir';
import { stub } from 'sinon';
import proxyquire from 'proxyquire';

const execaStub = stub();
const gitCommitExeca = proxyquire.noCallThru().noPreserveCache().load('../../lib/helpers/gitCommitExeca', { execa: execaStub });

const filename = 'testretry';
const sgcTempDir = path.join(tempDir, 'sgc');
const pathToRetryFile = path.join(sgcTempDir, `${filename}.txt`);

test.beforeEach(() => {
  fs.removeSync(pathToRetryFile);
});

test('commit should fail', async (t) => {
  execaStub.returns(Promise.reject());

  const isOk = await gitCommitExeca.default('hello', filename);
  const file = await fs.readFile(pathToRetryFile, 'utf8');

  t.false(isOk);
  t.is(file, 'hello');
});

test('commit should pass', async (t) => {
  execaStub.returns(Promise.resolve());

  const isOk = await gitCommitExeca.default('hello', filename);

  t.true(isOk);
  t.false(await fs.exists(pathToRetryFile));
});
