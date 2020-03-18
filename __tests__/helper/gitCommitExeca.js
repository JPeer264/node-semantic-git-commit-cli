import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';
import tempDir from 'temp-dir';

import gitCommitExeca from '../../lib/helpers/gitCommitExeca';

const filename = 'testretry';
const sgcTempDir = path.join(tempDir, 'sgc');
const pathToRetryFile = path.join(sgcTempDir, `${filename}.txt`);

jest.mock('execa');

beforeEach(() => {
  fs.removeSync(pathToRetryFile);
});

it('commit should fail', async () => {
  execa.mockReturnValue(Promise.reject());

  const isOk = await gitCommitExeca('hello', filename);
  const file = await fs.readFile(pathToRetryFile, 'utf8');

  expect(isOk).toBe(false);
  expect(file).toBe('hello');
});

it('commit should pass', async () => {
  execa.mockReturnValue(Promise.resolve());

  const isOk = await gitCommitExeca('hello', filename);

  expect(isOk).toBe(true);
  expect(await fs.exists(pathToRetryFile)).toBe(false);
});
