import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import tempDir from 'temp-dir';

import retryCommit from '../../lib/helpers/retryCommit';
import gitCommitExeca from '../../lib/helpers/gitCommitExeca';

jest.mock('../../lib/helpers/gitCommitExeca');

const filename = 'testretry';
const sgcTempDir = path.join(tempDir, 'sgc');
const pathToRetryFile = path.join(sgcTempDir, `${filename}.txt`);

beforeEach(() => {
  gitCommitExeca.mockReset();
  console.error = jest.fn();
});

it('commit should fail', async () => {
  await retryCommit(filename);

  expect(console.error).toBeCalledWith(chalk.red('No previous failed commit found.'));
});

it('commit should pass', async () => {
  await fs.ensureDir(sgcTempDir);
  await fs.writeFile(pathToRetryFile, 'new commit', 'utf8');
  await retryCommit(filename);

  expect(gitCommitExeca).toBeCalledWith('new commit');
});
