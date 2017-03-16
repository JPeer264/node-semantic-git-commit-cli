#!/usr/bin/env node
import chalk from 'chalk';
import execa from 'execa';
import inquirer from 'inquirer';
import { config, choices, questions } from './promptConfig';

const configuration = config();
const choicesList = choices(configuration);
const questionsList = questions(choicesList);

inquirer.prompt(questionsList).then((answers) => {
  const message = answers.moreInfo ? `${answers.editor}` : `${answers.type} ${answers.description}`;

  return execa('git', ['commit', '-m', message])
    .then(result => console.log(result.stdout))
    .catch((err) => {
      console.error(chalk.red("Have you thought about 'git add' some files? Add files and try run following again:\n"));
      console.error(chalk.green(err.cmd));
    });
});
