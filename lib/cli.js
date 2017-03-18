#!/usr/bin/env node
import chalk from 'chalk';
import execa from 'execa';
import yargs from 'yargs';
import git from 'git-utils';
import inquirer from 'inquirer';
import updateNotifier from 'update-notifier';

import pkg from '../package.json';
import getConfig from './getConfig';
import { choices, questions } from './promptConfig';

const repository = git.open(process.cwd());
const configuration = getConfig();
const choicesList = choices(configuration);
const questionsList = questions(choicesList);
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
} else if (!repository) {
  console.error('fatal: Not a git repository (or any of the parent directories): .git');
} else {
  inquirer.prompt(questionsList).then((answers) => {
    const message = answers.moreInfo ? `${answers.editor}` : `${answers.type} ${answers.description}`;

    return execa('git', ['commit', '-m', message])
      .then(result => console.log(result.stdout))
      .catch(() => {
        console.error(chalk.red("Have you thought about 'git add' some files? Add files and try run following again:\n"));
        console.error(chalk.green(`git commit -m "${message}"`));
      });
  });
}

