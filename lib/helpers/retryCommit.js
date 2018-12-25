import fs from 'fs-extra';
import path from 'path';
import tempDir from 'temp-dir';
import chalk from 'chalk';

import gitCommitExeca from './gitCommitExeca';

const retryCommit = async (filename = 'retry') => {
  const sgcTempDir = path.join(tempDir, 'sgc');
  const pathToRetryFile = path.join(sgcTempDir, `${filename}.txt`);

  try {
    const message = await fs.readFile(pathToRetryFile, 'utf8');

    await fs.unlink(pathToRetryFile);
    await gitCommitExeca(message);
  } catch (_) {
    console.error(chalk.red('No previous failed commit found.'));
  }
};

export default retryCommit;
