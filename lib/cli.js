#!/usr/bin/env node

import chalk from 'chalk';
import commitCount from 'git-commit-count';
import execa from 'execa';
import inquirer from 'inquirer';
import isAdded from 'is-git-added';
import isGit from 'is-git-repository';
import updateNotifier from 'update-notifier';
import yargs from 'yargs';

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

const gitCommitExeca = message => (
  execa('git', ['commit', '-m', message], { stdio: 'inherit' })
    .catch(() => {
      console.error(chalk.red('\nAn error occured. Try to resolve the previous error and run following commit message again:'));
      console.error(chalk.green(`git commit -m "${message}"`));
    })
);

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
} else if (commitCount() === 0 &&
  typeof config.initCommit === 'object' &&
  config.initCommit.isEnabled) {
  const message = initMessage(config);

  inquirer.prompt(question).then(answers => (
    answers.initCommit ? gitCommitExeca(message) : undefined
  ));
} else {
  inquirer.prompt(questionsList).then((answers) => {
    const typeScope = combineTypeScope(answers.type, answers.scope);
    const message = answers.body ? `${answers.editor}` : `${typeScope} ${answers.description}`;

    return gitCommitExeca(message);
  });
}
