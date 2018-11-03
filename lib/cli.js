#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import commitCount from 'git-commit-count';
import execa from 'execa';
import inquirer from 'inquirer';
import isAdded from 'is-git-added';
import isGit from 'is-git-repository';
import updateNotifier from 'update-notifier';
import yargs from 'yargs';
import tempDir from 'temp-dir';

import getConfig from './getConfig';
import combineTypeScope from './helpers/combineTypeScope';
import pkg from '../package.json';
import questions, {
  initMessage,
  initQuestion,
} from './questions';

const config = getConfig();
const questionsList = questions(config);
const question = initQuestion(config);
const sgcTempDir = path.join(tempDir, 'sgc');
const pathToRetryFile = path.join(sgcTempDir, 'retry.txt');

const gitCommitExeca = async (message) => {
  try {
    await execa('git', ['commit', '-m', message], { stdio: 'inherit' });
  } catch (_) {
    console.error(chalk.red('\nAn error occured. Try to resolve the previous errors and run following command:'));
    console.error(chalk.green('sgc --retry'));

    await fs.ensureDir(sgcTempDir);
    await fs.writeFile(pathToRetryFile, message, 'utf8');
  }
};

const argv = yargs
  .usage('Usage: $0')
  .alias('v', 'version')
  .describe('v', 'Version number')
  .alias('r', 'retry')
  .describe('r', 'Retry your previous failed commit')
  .help('h')
  .alias('h', 'help')
  .argv;

const sgcPrompt = async () => {
  const answers = await inquirer.prompt(questionsList);
  const typeScope = combineTypeScope(answers.type, answers.scope);
  const message = answers.body ? `${answers.editor}` : `${typeScope} ${answers.description}`;

  return gitCommitExeca(message);
};

updateNotifier({ pkg }).notify();

if (argv.v) {
  console.log(`v${pkg.version}`);
} else if (!isGit()) {
  console.error('fatal: Not a git repository (or any of the parent directories): .git');
} else if (!isAdded()) {
  console.error(chalk.red('Please', chalk.bold('git add'), 'some files first before you commit.'));
} else if (argv.r) {
  fs.readFile(pathToRetryFile, 'utf8')
    .then(async (message) => {
      await fs.unlink(pathToRetryFile);
      await gitCommitExeca(message);
    })
    .catch(() => {
      console.error(chalk.red('No previous failed commit found.'));
    });
} else if (
  commitCount() === 0
  && typeof config.initialCommit === 'object'
  && config.initialCommit.isEnabled
) {
  const message = initMessage(config);

  inquirer.prompt(question).then(async (answers) => {
    if (answers.initCommit) {
      await gitCommitExeca(message);
    } else {
      await sgcPrompt();
    }
  });
} else {
  sgcPrompt();
}
