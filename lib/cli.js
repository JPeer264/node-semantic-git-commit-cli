#!/usr/bin/env node

import chalk from 'chalk';
import commitCount from 'git-commit-count';
import isAdded from 'is-git-added';
import isGit from 'is-git-repository';
import updateNotifier from 'update-notifier';
import yargs from 'yargs';

import getConfig from './getConfig';
import pkg from '../package.json';
import retryCommit from './helpers/retryCommit';
import sgcPrompt from './helpers/sgcPrompt';
import promptOrInitialCommit from './helpers/promptOrInitialCommit';

const config = getConfig();

const argv = yargs
  .usage('Usage: $0')
  .alias('v', 'version')
  .describe('v', 'Version number')
  .alias('r', 'retry')
  .describe('r', 'Retry your previous failed commit')
  .help('h')
  .alias('h', 'help')
  .argv;

updateNotifier({ pkg }).notify();

if (argv.v) {
  console.log(`v${pkg.version}`);
} else if (!isGit()) {
  console.error('fatal: Not a git repository (or any of the parent directories): .git');
} else if (!isAdded()) {
  console.error(chalk.red('Please', chalk.bold('git add'), 'some files first before you commit.'));
} else if (argv.r) {
  retryCommit();
} else if (
  commitCount() === 0
  && typeof config.initialCommit === 'object'
  && config.initialCommit.isEnabled
) {
  promptOrInitialCommit();
} else {
  sgcPrompt();
}
