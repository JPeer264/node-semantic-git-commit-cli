import execa from 'execa';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import tempDir from 'temp-dir';

const gitCommitExeca = async (message) => {
  const sgcTempDir = path.join(tempDir, 'sgc');
  const pathToRetryFile = path.join(sgcTempDir, 'retry.txt');

  try {
    await execa('git', ['commit', '-m', message], { stdio: 'inherit' });
  } catch (_) {
    console.error(chalk.red('\nAn error occured. Try to resolve the previous errors and run following command:'));
    console.error(chalk.green('sgc --retry'));

    await fs.ensureDir(sgcTempDir);
    await fs.writeFile(pathToRetryFile, message, 'utf8');
  }
};

export default gitCommitExeca;
