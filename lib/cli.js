#!/usr/bin/env node
import chalk from 'chalk';
import execa from 'execa';
import inquirer from 'inquirer';
import getConfig from './getConfig';
import { choices, questions } from './promptConfig';

const configuration = getConfig();
const choicesList = choices(configuration);
const questionsList = questions(choicesList);

const prompt = inquirer.prompt(questionsList);

prompt.ui.process.subscribe((answer) => {
  if (answer.name === 'commitMessageWarning') {
    const continueExecution = answer.answer;
    if (!continueExecution) {
      process.exit();
    }
  }
});

prompt.then((answers) => {
  const message = answers.moreInfo ? `${answers.editor}` : `${answers.type} ${answers.commitMessage}`;

  return execa('git', ['commit', '-m', message])
    .then(result => console.log(result.stdout))
    .catch(() => {
      console.log();
      console.error(chalk.red("Have you thought about 'git add' some files? Add files and try run following again:\n"));
      console.error(chalk.green(`git commit -m "${message}"`));
    });
});
