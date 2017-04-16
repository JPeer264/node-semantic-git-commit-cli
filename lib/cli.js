#!/usr/bin/env node
import chalk from 'chalk';
import execa from 'execa';
import yargs from 'yargs';
import inquirer from 'inquirer';
import isGit from 'is-git-repository';
import updateNotifier from 'update-notifier';

import pkg from '../package.json';
import getConfig from './getConfig';
import { choices, questions } from './promptConfig';

const configuration = getConfig();
const choicesList = choices(configuration);
const questionsList = questions(choicesList, configuration);
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
} else {
  inquirer.prompt(questionsList).then((answers) => {
    const message = answers.moreInfo ? `${answers.editor}` : `${answers.type} ${answers.description}`;

    return execa('git', ['commit', '-m', message], { stdio: 'inherit' })
      .catch(() => {
        console.error(chalk.red('\nAn error occured. Try to resolve the previous error and run following commit message again:'));
        console.error(chalk.green(`git commit -m "${message}"`));
      });
  });
}

