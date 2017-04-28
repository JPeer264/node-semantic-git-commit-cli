#!/usr/bin/env node
import chalk from 'chalk';
import execa from 'execa';
import yargs from 'yargs';
import inquirer from 'inquirer';
import isGit from 'is-git-repository';
import isAdded from 'is-git-added';
import updateNotifier from 'update-notifier';

import pkg from '../package.json';
import getConfig from './getConfig';
import questions from './questions';
import combineTypeScope from './helpers/combineTypeScope';

const config = getConfig();
const questionsList = questions(config);
const argv = yargs
  .usage('Usage: $0')
  .alias('v', 'version')
  .describe('v', 'Version number')
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
} else {
  inquirer.prompt(questionsList).then((answers) => {
    const typeScope = combineTypeScope(answers.type, answers.scope);
    const message = answers.moreInfo ? `${answers.editor}` : `${typeScope} ${answers.description}`;

    return execa('git', ['commit', '-m', message], { stdio: 'inherit' })
      .catch(() => {
        console.error(chalk.red('\nAn error occured. Try to resolve the previous error and run following commit message again:'));
        console.error(chalk.green(`git commit -m "${message}"`));
      });
  });
}

