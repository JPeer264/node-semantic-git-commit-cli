import chalk from 'chalk';
import inquirer from 'inquirer';
import commitCount from 'git-commit-count';
import isAdded from 'is-git-added';
import isGit from 'is-git-repository';

import Config from './Config';
import pkg from '../package.json';
import retryCommit from './helpers/retryCommit';
import sgcPrompt from './helpers/sgcPrompt';
import promptOrInitialCommit from './helpers/promptOrInitialCommit';

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const cli = async (argv = {}) => {
  const { config } = new Config();

  if (argv.v) {
    console.log(`v${pkg.version}`);
  } else if (!isGit()) {
    console.error('fatal: Not a git repository (or any of the parent directories): .git');
  } else if (!isAdded()) {
    console.error(chalk.red('Please', chalk.bold('git add'), 'some files first before you commit.'));
  } else if (argv.r) {
    await retryCommit();
  } else if (
    commitCount() === 0
    && typeof config.initialCommit === 'object'
    && config.initialCommit.isEnabled
  ) {
    await promptOrInitialCommit();
  } else {
    await sgcPrompt(argv);
  }
};

export default cli;
